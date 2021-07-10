import * as React from 'react';
import {
  Dimensions,
  DeviceEventEmitter,
  NativeModules,
  AppState,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal-patch';
import InCallManager from 'react-native-incall-manager';
import uuidv4 from 'uuidv4';
import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
} from 'react-native-webrtc';
import { ReactReduxContext } from 'react-redux';
import RNCallKeep from 'react-native-callkeep';
import apiManager, { MediaChatTracker } from './api';
import AudioChatView from './AudioChatView';
import VideoChatView from './VideoChatView';
import { callID } from '../../config';

const { LaunchManager } = NativeModules;

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const servers = {
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'beaver',
      username: 'webrtc.websitebeaver@gmail.com',
    },
  ],
};

const state = {
  modalVisible: false,
  localStream: null,
  remoteStreams: null,
  isComInitiated: true,
  peerConnectionStarted: false,
  isMuted: false,
  isSpeaker: false,
  hoursCounter: '00',
  minutesCounter: '00',
  secondsCounter: '00',
  initialCallState: 'Calling',
  appState: AppState.currentState,
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
    this.callAccepted = false;
    this.isFromLaunchManager = false;
    this.callRequested = false;
    this.sentOffersId = [];
    this.chatTimeout = 40000;
    // this.chatTimeout = 26000; /single
    this.activeChatRoomParticipants = [];
    this.readConnectionIds = [];
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
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.mediaChatTracker && this.mediaChatTracker.unsubscribe();
  }

  componentDidUpdate(prevProps) {
    this.onComponentVisibilityChange(prevProps);
    this.onChannelDataChange(prevProps);
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

  subscribeMediaTrackerIfNecessary = () => {
    this.getDataFromLaunchManager((launchData) => {
      if (!launchData) {
        this.mediaChatTracker.subscribe();
      } else {
        this.mediaChatTracker.subscribe(false);
      }
    });
  };

  onComponentVisibilityChange = (prevProps) => {
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
  };

  onChannelDataChange = (prevProps) => {
    if (
      this.props.mediaChatData &&
      prevProps.mediaChatData !== this.props.mediaChatData
    ) {
      if (this.props.mediaChatData.message) {
        this.readChannelData(this.props.mediaChatData);
      }
    }
  };

  handleChannelDataAvailability = () => {
    if (this.props.mediaChatData) {
      InCallManager.startRingtone('_DEFAULT_');
      this.setState({
        isComInitiated: false,
      });
    } else {
      if (this.props.chatType === 'video') {
        InCallManager.start({ media: 'audio/video', ringback: '_DTMF_' });
      } else {
        InCallManager.start({ media: 'audio', ringback: '_DTMF_' });
      }
    }
  };

  getLocalStream = async () => {
    const isFront = true;

    if (!this.devices) {
      const devices = await mediaDevices.enumerateDevices();

      if (devices) {
        this.devices = devices;
      }
    }

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId =
      this.devices &&
      this.devices.find(
        (device) => device.kind === 'videoinput' && device.facing === facing,
      );
    const facingMode = isFront ? 'user' : 'environment';
    let constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          width: WIDTH,
          height: HEIGHT,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    if (this.props.chatType === 'audio') {
      constraints = {
        audio: true,
        video: false,
      };
    }

    const newLocalStream = await mediaDevices.getUserMedia(constraints);

    return newLocalStream;
  };

  onCallConnectionDataSubscribe = (data) => {
    const enable = this.callAccepted || this.callRequested;

    data.forEach((dataItem) => {
      const haveRead = this.readConnectionIds.includes(dataItem.id);
      if (!haveRead && enable) {
        this.readChannelData(dataItem);
      }
    });
  };

  getDataFromLaunchManager = (callback) => {
    if (Platform.OS !== 'android') {
      callback(null);
      return;
    }

    LaunchManager.getLaunchManagerData((launchManagerData) => {
      callback(launchManagerData);
    });
  };

  onLaunchManagerData = () => {
    if (Platform.OS !== 'android') {
      return;
    }

    this.getDataFromLaunchManager(async (launchManagerData) => {
      if (launchManagerData) {
        await this.mediaChatTracker.unsubscribe();
        await this.mediaChatTracker.subscribe(false);
        this.callAccepted = true;
        this.isFromLaunchManager = true;

        if (this.props.audioVideoChatReceivers?.length) {
          this.setState({
            isComInitiated: true,
            modalVisible: true,
          });
        }
      }

      LaunchManager.resetLaunchManagerData();
    });
  };

  onModalShow = async () => {
    clearTimeout(this.noAnswerTimer);

    if (AppState.currentState !== 'active') {
      return;
    }

    if (this.props.mediaChatData?.status === 'request') {
      this.handleIncomingCall();
    }

    if (this.props.mediaChatData?.status === 'initiated') {
      this.subscribeCallConnectionData();
      this.handleCallInitiated();
    }

    if (!this.state.localStream) {
      const localStream = await this.getLocalStream();
      this.setState({
        localStream,
      });
    }
  };

  subscribeCallConnectionData = () => {
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;

    this.mediaChatTracker.subscribeCallConnectionData(
      { channelId, userId },
      this.onCallConnectionDataSubscribe,
    );
  };

  handleIncomingCall = () => {
    if (AppState.currentState === 'active' && !this.callAccepted) {
      this.setState({
        isComInitiated: false,
      });
      InCallManager.startRingtone('_DEFAULT_');
    }

    this.noAnswerTimer = setTimeout(() => {
      if (!this.callAccepted) {
        this.onEndCall();
      }
    }, this.chatTimeout - 1000);
    if (this.isFromLaunchManager && this.callAccepted) {
      this.onAcceptCall();
      this.isFromLaunchManager = false;
    }
  };

  handleCallInitiated = () => {
    if (this.props.chatType === 'video') {
      InCallManager.start({ media: 'audio/video', ringback: '_DTMF_' });
    } else {
      InCallManager.start({ media: 'audio', ringback: '_DTMF_' });
    }
    // signal for communication from user(s)
    this.tryToRequestCommunication();
  };

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

  initializeCallKeep = async () => {
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
      // RNCallKeep.setup(options);
      // RNCallKeep.setAvailable(true);
      RNCallKeep.addEventListener('endCall', this.onEndCallAction);
      RNCallKeep.addEventListener('answerCall', this.onAnswerCallAction);
      // Platform.OS == 'android' &&
      //   this.mediaChatTracker.subscribeMessaging((remoteMessage) =>
      //     this.processRemoteMessage(remoteMessage),
      //   );
    } catch (error) {
      console.log(error);
    }
  };

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

  getPeerConnection = (id) => {
    const { user, chatType, channelId } = this.props;
    const userId = user.id || user.userID;
    const messageData = {
      senderId: userId,
      receiverId: id,
      type: chatType,
      channelId: channelId,
    };

    if (this.peerConnections[id]) {
      return this.peerConnections[id];
    }
    const pc = new RTCPeerConnection(servers);
    this.peerConnections[id] = pc;
    pc.addStream(this.state.localStream);
    pc.onicecandidate = (evnt) => {
      evnt.candidate
        ? this.mediaChatTracker.addCallConnectionData({
            ...messageData,
            message: { ice: JSON.parse(JSON.stringify(evnt.candidate)) },
          })
        : console.log('Sent All Ice');
    };
    pc.onaddstream = (evnt) => {
      if (this.callAccepted) {
        // this.setState({
        //   remoteStreams: { ...this.state.remoteStreams, [id]: evnt.stream },
        // });
        clearTimeout(this.noAnswerTimer);
        this.setState(
          {
            remoteStreams: {
              ...this.state.remoteStreams,
              [id]: evnt.stream,
            },
          },
          async () => {
            if (this.props.chatType === 'audio' && !this.timerInterval) {
              this.onTimerStart();
            }
          },
        );
      }
    };
    return pc;
  };

  tryToRequestCommunication = () => {
    this.requestCall();
  };

  requestCall = async () => {
    this.callRequested = true;
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;

    this.mediaChatTracker.cleanChatRoomParticipants(channelId);
    this.mediaChatTracker.addChatRoomParticipants({ channelId, userId });
    this.subscribeChatRoomParticipants();
    this.signalReceivers('request', this.props.chatType);
    this.noAnswerTimer = setTimeout(() => {
      if (!this.callAccepted) {
        this.endCall();
      }
    }, this.chatTimeout - 1000);
  };

  signalReceivers = async (status, chatType) => {
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

    await apiManager.signalChatRoomParticipants(newData);
  };

  handleNewParticipants = (updatedParticipants) => {
    if (!this.modalVisible) {
      return;
    }

    const { user } = this.props;
    const remoteStreams = this.state.remoteStreams;
    const userId = user.id || user.userID;
    let offerReceivers = [];
    const exitedParticipants = [];
    const activeParticipants = [...this.activeChatRoomParticipants];
    let sentOffersId = [...this.sentOffersId];

    const sortedParticipants = updatedParticipants.sort((a, b) => {
      if (!a.createdAt) {
        return -1;
      }
      if (!b.createdAt) {
        return 1;
      }
      a = new Date(a.createdAt.seconds);
      b = new Date(b.createdAt.seconds);
      return a > b ? -1 : a < b ? 1 : 0;
    });

    const userIndexAfterSorted = sortedParticipants.findIndex(
      (participant) => participant.participantId === userId,
    );

    if (userIndexAfterSorted > -1) {
      offerReceivers = sortedParticipants.slice(0, userIndexAfterSorted);
      this.offerReceivers = sortedParticipants.slice(0, userIndexAfterSorted);
    }

    offerReceivers.forEach((receiver) => {
      this.callAccepted = true;
      this.sendOffer(receiver.participantId);
    });

    activeParticipants.forEach((activeParticipant) => {
      const stillActiveParticipant = updatedParticipants.find(
        (updatedParticipant) =>
          activeParticipant.participantId === updatedParticipant.participantId,
      );
      if (!stillActiveParticipant && activeParticipant) {
        exitedParticipants.push(activeParticipant);
      }
    });

    if (remoteStreams) {
      exitedParticipants.forEach((exitedParticipant) => {
        if (this.peerConnections[exitedParticipant.participantId]) {
          this.peerConnections[exitedParticipant.participantId].close();
          delete this.peerConnections[exitedParticipant.participantId];
        }
        delete remoteStreams[exitedParticipant.participantId];
        sentOffersId = sentOffersId.filter(
          (connectionId) => connectionId !== exitedParticipant.participantId,
        );
      });
      this.setState({
        remoteStreams,
      });
    }

    if (this.callAccepted || this.callRequested) {
      this.activeChatRoomParticipants = [...sortedParticipants];
      this.sentOffersId = sentOffersId;
    }
  };

  sendOffer = async (participantId) => {
    const alreadySent = this.sentOffersId.includes(participantId);

    if (alreadySent) {
      return;
    }

    const { user, chatType, channelId } = this.props;
    const userId = user.id || user.userID;
    const messageData = {
      senderId: userId,
      receiverId: participantId,
      type: chatType,
      channelId: channelId,
    };

    if (this.callAccepted || this.callRequested) {
      const pc = this.getPeerConnection(participantId);
      this.sentOffersId = [...this.sentOffersId, participantId];
      InCallManager.stopRingback();
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await this.mediaChatTracker.addCallConnectionData({
          ...messageData,
          message: { sdp: JSON.parse(JSON.stringify(pc.localDescription)) },
        });
      } catch (err) {
        console.error(err);
      }

      if (!this.state.peerConnectionStarted) {
        this.setState({
          peerConnectionStarted: true,
        });
      }
    }
  };

  readChannelData = async (data) => {
    if (this.callAccepted || this.callRequested) {
      const { message, receiverId, senderId, id } = data;
      const { user, chatType, channelId } = this.props;
      const pc = this.getPeerConnection(senderId);
      const userId = user.id || user.userID;
      const messageData = {
        senderId: userId,
        receiverId: senderId,
        type: chatType,
        channelId: channelId,
      };

      this.readConnectionIds = [...this.readConnectionIds, id];

      try {
        if (receiverId === userId) {
          if (message.ice !== undefined) {
            await pc.addIceCandidate(new RTCIceCandidate(message.ice));
          } else if (message.sdp.type === 'offer') {
            await pc.setRemoteDescription(
              new RTCSessionDescription(message.sdp),
            );
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            await this.mediaChatTracker.addCallConnectionData({
              ...messageData,
              message: { sdp: JSON.parse(JSON.stringify(pc.localDescription)) },
            });
          } else if (message.sdp.type === 'answer') {
            await pc.setRemoteDescription(
              new RTCSessionDescription(message.sdp),
            );
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  switchCamera = () => {
    this.state.localStream
      .getVideoTracks()
      .forEach((track) => track._switchCamera());
  };

  onTimerStart = () => {
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
  };

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

  toggleMute = () => {
    const { remoteStreams, localStream } = this.state;
    if (!remoteStreams) return;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
    this.setState((prevState) => ({
      isMuted: !prevState.isMuted,
    }));
  };

  onAcceptCall = async () => {
    clearTimeout(this.endCallTimeout);
    this.callAccepted = true;
    this.subscribeCallConnectionData();
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;
    this.setState(
      {
        isComInitiated: true,
        peerConnectionStarted: true,
        initialCallState: 'Connecting',
      },
      async () => {
        InCallManager.stopRingtone();
        if (this.props.chatType === 'video') {
          InCallManager.start({ media: 'audio/video' });
        } else {
          InCallManager.start({ media: 'audio' });
        }

        this.mediaChatTracker.addChatRoomParticipants({
          channelId,
          userId,
        });

        this.subscribeChatRoomParticipants();
      },
    );
  };

  subscribeChatRoomParticipants = async () => {
    const { user, channelId } = this.props;
    const userId = user.id || user.userID;

    await this.mediaChatTracker.subscribeChatRoomParticipants(
      { channelId, userId },
      (participants) => {
        this.handleNewParticipants(participants);
      },
    );
  };

  onEndCall = () => {
    this.callAccepted = false;
    // const participantsId = this.props.audioVideoChatReceivers.map(
    //   (receiver) => receiver.id || receiver.userID,
    // );

    this.mediaChatTracker.unsubscribeChatRoomParticipants(this.props.channelId);
    clearInterval(this.timerInterval);
    this.setState({
      isComInitiated: true,
    });

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

    if (this.state.localStream && this.state.localStream.getTracks) {
      this.state.localStream.getTracks().forEach((track) => track.stop());
      this.state.localStream.release();
    }

    Object.keys(this.peerConnections).forEach((id) => {
      if (this.peerConnections[id]) {
        this.peerConnections[id].close();
      }
    });
    this.peerConnections = {};

    this.resetModalState();
  };

  resetModalState = () => {
    this.setState({
      ...state,
    });

    this.timerInterval = null;
    this.hasChatRoomSubscribe = false;
    this.callAccepted = false;
    this.isFromLaunchManager = false;
    this.didAnswer = false;
    this.callRequested = false;
    this.sentOffersId = [];
    this.readConnectionIds = [];
    this.mediaChatTracker.onMediaChatDismiss();
  };

  endCall = (shouldSignal = false) => {
    if (this.modalVisible || shouldSignal) {
      if (this.props.audioVideoChatReceivers.length === 1) {
        this.signalReceivers('cancel', this.props.chatType);
        this.mediaChatTracker.cleanChatRoomParticipants(this.props.channelId);
      }

      this.onEndCall();
    }
  };

  render() {
    const { audioVideoChatReceivers, chatType, channelTitle } = this.props;
    const {
      remoteStreams,
      localStream,
      isComInitiated,
      peerConnectionStarted,
      isMuted,
      isSpeaker,
      minutesCounter,
      hoursCounter,
      secondsCounter,
      initialCallState,
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
        {remoteStreams && chatType === 'video' && (
          <VideoChatView
            remoteStreams={remoteStreams}
            localStream={localStream}
            isComInitiated={isComInitiated}
            peerConnectionStarted={peerConnectionStarted}
            isMuted={isMuted}
            isSpeaker={isSpeaker}
            switchCamera={this.switchCamera}
            toggleSpeaker={this.toggleSpeaker}
            toggleMute={this.toggleMute}
            endCall={this.endCall}
            onAcceptCall={this.onAcceptCall}
          />
        )}
        {(!remoteStreams || chatType === 'audio') && (
          <AudioChatView
            initialCallState={initialCallState}
            audioVideoChatReceivers={audioVideoChatReceivers}
            channelTitle={channelTitle}
            remoteStreams={remoteStreams}
            hoursCounter={hoursCounter}
            minutesCounter={minutesCounter}
            secondsCounter={secondsCounter}
            isComInitiated={isComInitiated}
            isSpeaker={isSpeaker}
            isMuted={isMuted}
            toggleSpeaker={this.toggleSpeaker}
            endCall={this.endCall}
            onAcceptCall={this.onAcceptCall}
            toggleMute={this.toggleMute}
          />
        )}
      </Modal>
    );
  }
}

export default IMAudioVideoChat;
