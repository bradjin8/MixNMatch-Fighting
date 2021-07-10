import * as React from 'react';
import {
  Dimensions,
  DeviceEventEmitter,
  NativeModules,
  AppState,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal-patch';
import InCallManager from 'react-native-incall-manager';
import uuidv4 from 'uuidv4';
import { TwilioVideo } from 'react-native-twilio-video-webrtc';
import { ReactReduxContext } from 'react-redux';
import RNCallKeep from 'react-native-callkeep';
import VoipPushNotification from 'react-native-voip-push-notification';
import { apiManager } from './api';
import MediaChatTracker from './tracker';
import AudioChatView from './AudioChatView';
import VideoChatView from './VideoChatView';
import { callID } from '../../config';
import { TWILIO_SERVER_ENDPOINT } from '../config';

const { LaunchManager } = NativeModules;

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const state = {
  modalVisible: false,
  remoteStreams: null,
  isComInitiated: true,
  isSpeaker: false,
  hoursCounter: '00',
  minutesCounter: '00',
  secondsCounter: '00',
  initialCallState: 'Calling',
  appState: AppState.currentState,
  isForeground: AppState.currentState === 'active',
  isAudioEnabled: true,
  isCallAccepted: false,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
};

class IMAudioVideoChat extends React.Component {
  static contextType = ReactReduxContext;

  static showVideoChatModal = () => {
    if (!IMAudioVideoChat.modalVisible) {
      DeviceEventEmitter.emit('showVideoChatModal');
    }
  };

  static showAudioChatModal = () => {
    if (!IMAudioVideoChat.modalVisible) {
      DeviceEventEmitter.emit('showAudioChatModal');
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      ...state,
    };

    this.devices = null;
    this.peerConnections = {};
    this.modalVisible = false;
    this.timerInterval = null;
    this.hasChatRoomSubscribe = false;
    this.isFromLaunchManager = false;
    this.callRequested = false;
    this.didAnswer = false;
    this.sentOffersId = [];
    this.chatTimeout = 40000;
    // this.chatTimeout = 26000; /single
    this.activeChatRoomParticipants = [];
    this.readConnectionIds = [];

    this.twilioVideoRef = React.createRef();
  }

  componentDidMount() {
    const { user } = this.props;
    const userID = user.id || user.userID;

    AppState.addEventListener('change', this.handleAppStateChange);
    this.mediaChatTracker = new MediaChatTracker(
      this.context.store,
      userID,
      this.chatTimeout,
    );
    this.subscribeMediaTrackerIfNecessary();

    this.initializeCallKeep();
    this.subscribeIOSpushKit();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.mediaChatTracker && this.mediaChatTracker.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    this.onComponentVisibilityChange(prevProps);
  }

  handleAppStateChange = (nextAppState) => {
    const isForeground = nextAppState === 'active';

    this.setState(
      {
        appState: nextAppState,
        isForeground: isForeground,
      },
      () => {
        isForeground && this.onLaunchManagerData();
      },
    );
  };

  subscribeIOSpushKit = () => {
    VoipPushNotification.addEventListener('notification', (notification) => {
      if (VoipPushNotification.wakeupByPush) {
        // --- remember to set this static variable back to false
        // --- since the constant are exported only at initialization time, and it will keep the same in the whole app
        VoipPushNotification.wakeupByPush = false;
      }
      // VoipPushNotification.onVoipNotificationCompleted(
      //   notification.getData().uuid,
      // );
    });
  };

  subscribeMediaTrackerIfNecessary() {
    this.getDataFromLaunchManager((launchData) => {
      if (!launchData) {
        this.mediaChatTracker.subscribe();
      } else {
        this.launchData = launchData;
        this.mediaChatTracker.subscribe(false);
      }
    });
  }

  onComponentVisibilityChange(prevProps) {
    if (this.props.isMediaChatVisible !== prevProps.isMediaChatVisible) {
      this.setState({
        modalVisible: this.props.isMediaChatVisible,
      });
      this.modalVisible = this.props.isMediaChatVisible;
      if (!this.props.isMediaChatVisible) {
        if (!this.props.mediaChatData) {
          InCallManager.stop({ busytone: '_DTMF_' });
        }
        this.onEndCall();
      }
    }
  }

  getDataFromLaunchManager(callback) {
    if (Platform.OS !== 'android') {
      callback(null);
      return;
    }

    LaunchManager.getLaunchManagerData((launchManagerData) => {
      callback(launchManagerData);
    });
  }

  onLaunchManagerData() {
    if (Platform.OS !== 'android') {
      return;
    }

    this.getDataFromLaunchManager(async (launchManagerData) => {
      this.launchManagerData = launchManagerData;

      if (launchManagerData) {
        await this.mediaChatTracker.unsubscribe();
        await this.mediaChatTracker.subscribe(false);
        this.isFromLaunchManager = true;

        if (this.props.audioVideoChatReceivers?.length > 0) {
          this.setState(
            {
              isComInitiated: true,
              modalVisible: true,
              initialCallState: 'Connecting',
            },
            () => {
              this.onAcceptCall();
            },
          );
        }
      }

      LaunchManager.resetLaunchManagerData();
    });
  }

  async getAccessToken() {
    const { user, channelId } = this.props;
    const identity = user.id || user.userID;

    try {
      const res = await fetch(
        `${TWILIO_SERVER_ENDPOINT}/?identity=${identity}&room=${channelId}`,
        {
          method: 'GET',
          headers: new Headers({
            'content-type': 'application/json',
          }),
        },
      );

      return await res.json();
    } catch (error) {
      console.log(error);
    }
  }

  onModalShow = async () => {
    clearTimeout(this.noAnswerTimer);

    if (AppState.currentState !== 'active') {
      return;
    }

    if (this.props.mediaChatData?.status === 'request') {
      this.handleIncomingCall();
    }
    if (this.props.mediaChatData?.status === 'initiated') {
      this.handleCallInitiated();
    }
  };

  handleIncomingCall() {
    if (
      AppState.currentState === 'active' &&
      !this.state.isCallAccepted &&
      !this.launchManagerData
    ) {
      this.setState({
        isComInitiated: false,
      });
    }

    this.noAnswerTimer = setTimeout(() => {
      if (!this.state.isCallAccepted) {
        // this.onEndCall();
      }
    }, this.chatTimeout - 1000);
    if (this.isFromLaunchManager && this.state.isCallAccepted) {
      // this.onAcceptCall();
      this.isFromLaunchManager = false;
    }

    if (this.props.chatType === 'audio') {
      this.twilioVideoRef.current.setLocalVideoEnabled(false);
      this.twilioVideoRef.current.unpublishLocalVideo();
    }
  }

  handleCallInitiated() {
    if (this.props.chatType === 'video') {
      InCallManager.start({ media: 'audio/video', ringback: '_DTMF_' });
    } else {
      InCallManager.start({ media: 'audio', ringback: '_DTMF_' });
      this.twilioVideoRef.current?.setLocalVideoEnabled(false);
    }
    // signal for communication from user(s)

    this.tryToRequestCommunication();
  }

  // Push Kit
  processRemoteMessage = (remoteMessage) => {
    console.log('processRemoteMessage ' + JSON.stringify(remoteMessage));

    const { callID, callerName, callType } = remoteMessage.data;
    console.log(callType);
    RNCallKeep.displayIncomingCall(
      callID,
      callerName,
      callerName,
      null,
      callType == 'video',
    );
  };

  initializeCallKeep() {
    const options = {
      ios: {
        appName: 'Instachatty',
      },
      android: {
        alertTitle: 'Permissions required',
        alertDescription:
          'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
      },
    };

    try {
      //  RNCallKeep.setup(options);
      // RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener('endCall', this.onEndCallAction); //undo
      RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
      // Platform.OS == 'android' &&
      // this.mediaChatTracker.subscribeMessaging((remoteMessage) =>
      //   this.processRemoteMessage(remoteMessage),
      // );
    } catch (error) {
      console.log(error);
    }
  }

  onEndCallAction = () => {
    if (!this.didAnswer) {
      this.endCall(true);
      RNCallKeep.endAllCalls();
    }
  };

  onAnswerCallAction = (body) => {
    this.didAnswer = true;
    if (Platform.OS === 'android') {
      return;
    }

    RNCallKeep.answerIncomingCall(callID);
    IMAudioVideoChat.showVideoChatModal();
    setTimeout(() => {
      RNCallKeep.endAllCalls();
    }, 1000);

    this.onAcceptCall();
  };

  tryToRequestCommunication() {
    this.requestCall();
  }

  async requestCall() {
    this.callRequested = true;
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;

    this.onConnectButtonPress();
    this.signalReceivers('request', this.props.chatType);
    this.noAnswerTimer = setTimeout(() => {
      if (!this.state.isCallAccepted) {
        this.endCall();
      }
    }, this.chatTimeout - 1000);
  }

  async signalReceivers(status, chatType) {
    const {
      audioVideoChatReceivers,
      user,
      channelId,
      channelTitle,
    } = this.props;
    const participantsId = audioVideoChatReceivers.map(
      (receiver) => receiver.id || receiver.userID,
    );

    const currentDate = new Date();
    const currentMiliSeconds = currentDate.getTime();
    const newData = {
      participantsId,
      channelId,
      channelTitle,
      senderId: user.id || user.userID,
      sender: user,
      receiver: audioVideoChatReceivers,
      type: chatType,
      status,
      id: uuidv4(),
      createdAt: { miliSeconds: currentMiliSeconds },
    };

    await apiManager.deletePrevSignalledParticipants(participantsId);
    await apiManager.signalChatRoomParticipants(newData);
  }

  onTimerStart() {
    this.timerInterval = setInterval(() => {
      const { hoursCounter, minutesCounter, secondsCounter } = this.state;
      let sec = (Number(secondsCounter) + 1).toString(),
        min = minutesCounter,
        hr = hoursCounter;

      if (Number(secondsCounter) === 59) {
        min = (Number(minutesCounter) + 1).toString();
        sec = '00';
      }

      if (Number(minutesCounter) === 59 && Number(secondsCounter) === 59) {
        hr = (Number(hoursCounter) + 1).toString();
        min = '00';
        sec = '00';
      }

      this.setState({
        minutesCounter: min.length === 1 ? '0' + min : min,
        secondsCounter: sec.length === 1 ? '0' + sec : sec,
        hoursCounter: hr.length === 1 ? '0' + hr : hr,
      });
    }, 1000);
  }

  toggleSpeaker = () => {
    this.setState(
      (prevState) => ({
        isSpeaker: !prevState.isSpeaker,
      }),
      () => {
        if (this.state.isSpeaker) {
          InCallManager.setForceSpeakerphoneOn(true);
        } else {
          InCallManager.setForceSpeakerphoneOn(null);
        }
      },
    );
  };

  onAcceptCall = async () => {
    this.signalReceivers('accepted', this.props.chatType);
    this.mediaChatTracker.setIsCallAccepted(true);
    clearTimeout(this.endCallTimeout);
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;
    this.setState(
      {
        isComInitiated: true,
        initialCallState: 'Connecting',
      },
      async () => {
        InCallManager.stopRingtone();
        if (this.props.chatType === 'video') {
          InCallManager.start({ media: 'audio/video' });
        } else {
          InCallManager.start({ media: 'audio' });
        }

        this.onConnectButtonPress();
      },
    );
  };

  onEndCall() {
    this.mediaChatTracker.setIsCallAccepted(false);
    const participantsId = this.props.audioVideoChatReceivers.map(
      (receiver) => receiver.id || receiver.userID,
    );
    this.onEndButtonPress();
    clearInterval(this.timerInterval);
    deletePrevSignalledParticipants(participantsId);

    this.setState({
      isComInitiated: true,
    });

    // RNCallKeep.rejectCall(callID); //undo
    RNCallKeep.endAllCalls();

    this.modalVisible = false;
    InCallManager.stopRingtone();
    InCallManager.stopRingback();

    if (
      this.props.mediaChatData &&
      this.props.mediaChatData.status === 'cancel' &&
      !this.state.remoteStreams
    ) {
      InCallManager.stop({ busytone: '_DEFAULT_' });
    } else {
      InCallManager.stop();
    }

    Object.keys(this.peerConnections).forEach((id) => {
      if (this.peerConnections[id]) {
        this.peerConnections[id].close();
      }
    });
    this.peerConnections = {};

    this.resetModalState();
  }

  resetModalState() {
    this.setState({
      ...state,
    });

    this.timerInterval = null;
    this.hasChatRoomSubscribe = false;
    this.isFromLaunchManager = false;
    this.didAnswer = false;
    this.callRequested = false;
    this.sentOffersId = [];
    this.readConnectionIds = [];
    this.mediaChatTracker.onMediaChatDismiss();
  }

  endCall = (shouldSignal = false) => {
    if (this.modalVisible || shouldSignal) {
      if (this.props.audioVideoChatReceivers.length === 1) {
        this.signalReceivers('cancel', this.props.chatType);
      }

      this.onEndCall();
    }
  };

  async onConnectButtonPress() {
    const { channelId } = this.props;
    const token = await this.getAccessToken();

    if (token) {
      if (Platform.OS === 'android') {
        await this.requestAudioPermission();
        await this.requestCameraPermission();
      }
      this.twilioVideoRef.current.connect({
        roomName: channelId,
        accessToken: token,
      });
      this.setState({ status: 'connecting' });
    }
  }

  onEndButtonPress() {
    this.twilioVideoRef.current?.disconnect();
  }

  onMuteButtonPress = () => {
    this.twilioVideoRef.current
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then((isEnabled) => this.setState({ isAudioEnabled: isEnabled }));
  };

  onFlipButtonPress = () => {
    this.twilioVideoRef.current.flipCamera();
  };

  onRoomDidConnect = () => {
    this.setState({ status: 'Connected' });
  };

  onRoomDidDisconnect = ({ error }) => {
    console.log('ERROR: ', error);
    this.setState({ status: 'disconnected', initialCallState: 'Disconnected' });
  };

  onRoomDidFailToConnect = (error) => {
    console.log('ERROR: ', error);

    this.setState({ status: 'disconnected', initialCallState: 'Disconnected' });
  };

  onParticipantAddedVideoTrack = ({ participant, track }) => {
    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ]),
    });

    if (this.props.isCallAccepted) {
      this.setState({
        isCallAccepted: true,
      });
      InCallManager.stopRingback();
    }
  };

  onParticipantAddedAudioTrack = ({}) => {
    if (this.props.isCallAccepted) {
      this.setState({
        isCallAccepted: true,
      });
      InCallManager.stopRingback();
    }

    if (this.props.chatType === 'audio' && !this.timerInterval) {
      this.onTimerStart();
    }
  };

  onParticipantRemovedVideoTrack = ({ participant, track }) => {
    this.setState({
      isCallAccepted: false,
      initialCallState: 'Disconnecting',
    });

    const videoTracks = this.state.videoTracks;
    videoTracks.delete(track.trackSid);

    this.setState({ videoTracks: new Map([...videoTracks]) });
  };

  requestAudioPermission = () => {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Need permission to access microphone',
        message:
          'To run this demo we need permission to access your microphone',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  };

  requestCameraPermission = () => {
    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Need permission to access camera',
      message: 'To run this demo we need permission to access your camera',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
  };

  render() {
    const { audioVideoChatReceivers, chatType, channelTitle } = this.props;
    const {
      remoteStreams,
      isComInitiated,
      isSpeaker,
      minutesCounter,
      hoursCounter,
      secondsCounter,
      initialCallState,
      // new code
      isAudioEnabled,
      videoTracks,
      isCallAccepted,
    } = this.state;

    return (
      <Modal
        onDismiss={this.endCall}
        onShow={this.onModalShow}
        visible={this.state.modalVisible}
        onRequestClose={this.endCall}
        animationType={'fade'}
        presentationStyle={'pageSheet'}
        useNativeDriver={false}
      >
        {isCallAccepted && chatType === 'video' && (
          <VideoChatView
            videoTracks={videoTracks}
            remoteStreams={remoteStreams}
            isComInitiated={isComInitiated}
            isMuted={!isAudioEnabled}
            isSpeaker={isSpeaker}
            switchCamera={this.onFlipButtonPress}
            toggleSpeaker={this.toggleSpeaker}
            toggleMute={this.onMuteButtonPress}
            endCall={this.endCall}
            onAcceptCall={this.onAcceptCall}
          />
        )}
        {(!remoteStreams || chatType === 'audio') && (
          <AudioChatView
            initialCallState={initialCallState}
            audioVideoChatReceivers={audioVideoChatReceivers}
            channelTitle={channelTitle}
            isCallAccepted={isCallAccepted}
            hoursCounter={hoursCounter}
            minutesCounter={minutesCounter}
            secondsCounter={secondsCounter}
            isComInitiated={isComInitiated}
            isSpeaker={isSpeaker}
            isMuted={!isAudioEnabled}
            toggleSpeaker={this.toggleSpeaker}
            endCall={this.endCall}
            onAcceptCall={this.onAcceptCall}
            toggleMute={this.onMuteButtonPress}
          />
        )}
        <TwilioVideo
          ref={this.twilioVideoRef}
          onRoomDidConnect={this.onRoomDidConnect}
          onRoomDidDisconnect={this.onRoomDidDisconnect}
          onRoomDidFailToConnect={this.onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this.onParticipantAddedVideoTrack}
          onParticipantAddedAudioTrack={this.onParticipantAddedAudioTrack}
          onParticipantRemovedVideoTrack={this.onParticipantRemovedVideoTrack}
        />
      </Modal>
    );
  }
}

export default IMAudioVideoChat;
