import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import styles from './styles';
import FastImage from 'react-native-fast-image';

const Image = FastImage;

const assets = {
  phoneCall: require('../../assets/phone-call.png'),
  endCall: require('../../assets/end-call.png'),
  microphone: require('../../assets/microphone.png'),
  speaker: require('../../assets/speaker.png'),
};

const VideoChatView = (props) => {
  const {
    remoteStreams,
    localStream,
    isComInitiated,
    peerConnectionStarted,
    isMuted,
    isSpeaker,
    toggleSpeaker,
    toggleMute,
    endCall,
    onAcceptCall,
  } = props;

  const newRemoteStreams = remoteStreams && Object.keys(remoteStreams);
  const [currentRemoteStreams, setCurrentRemoteStreams] = useState([]);
  const [currentLocalStream, setCurrentLocalStream] = useState(localStream);
  const [largeFillingRtcContainer, setLargeFillingRtcContainer] = useState(
    styles.largeFillingRtcContainer,
  );
  const [
    singleSmallLocalRtcContainer,
    setSingleSmallLocalRtcContainer,
  ] = useState([styles.singleSmallLocalRtcContainer]);
  const [isLocalLargeContainer, setIsLocalLargeContainer] = useState(false);
  const isNotGroupStream = newRemoteStreams.length === 1;

  useEffect(() => {
    const generatedRemoteStreams =
      newRemoteStreams &&
      newRemoteStreams.map((stream) => {
        return remoteStreams[stream];
      });
    setCurrentRemoteStreams(generatedRemoteStreams);
    setCurrentLocalStream(localStream);
  }, [remoteStreams]);

  const switchStreams = (stream, index) => {
    const oldLocalStream = currentLocalStream;
    const oldRemoteStreams = [...currentRemoteStreams];
    const oldLargeFillingRtcContainer = largeFillingRtcContainer;
    const oldSingleSmallLocalRtcContainer = singleSmallLocalRtcContainer;

    if (isNotGroupStream) {
      setLargeFillingRtcContainer(oldSingleSmallLocalRtcContainer);
      setSingleSmallLocalRtcContainer(oldLargeFillingRtcContainer);
      setIsLocalLargeContainer(
        (isLocalLargeContainer) => !isLocalLargeContainer,
      );
    } else {
      oldRemoteStreams[index] = oldLocalStream;
      setCurrentRemoteStreams(oldRemoteStreams);
      setCurrentLocalStream(stream);
    }
  };

  const renderRemoteStreams = (remoteStream, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (!isNotGroupStream) {
            switchStreams(remoteStream, index);
          }

          if (isLocalLargeContainer) {
            switchStreams(remoteStream, index);
          }
        }}
        key={index + ''}
        style={
          isNotGroupStream
            ? largeFillingRtcContainer
            : styles.groupSmallLocalRtcContainer
        }>
        <RTCView
          style={styles.rtcStream}
          objectFit={'contain'}
          zOrder={isLocalLargeContainer ? 2 : 1}
          streamURL={remoteStream.toURL()}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {localStream && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isLocalLargeContainer && isNotGroupStream) {
              switchStreams();
            }
          }}
          style={
            isNotGroupStream
              ? singleSmallLocalRtcContainer
              : [largeFillingRtcContainer]
          }>
          <RTCView
            style={styles.rtcStream}
            mirror={true}
            objectFit={'cover'}
            zOrder={isLocalLargeContainer ? 1 : 2}
            streamURL={currentLocalStream.toURL()}
          />
        </TouchableOpacity>
      )}

      {remoteStreams && (
        <View
          style={
            isNotGroupStream
              ? {
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                }
              : styles.remoteStreamsContainer
          }>
          {currentRemoteStreams.map((remoteStream, index) =>
            renderRemoteStreams(remoteStream, index),
          )}
        </View>
      )}
      <View style={styles.control}>
        <TouchableOpacity
          onPress={toggleSpeaker}
          style={[
            styles.controlIconContainer,
            isSpeaker && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.speaker}
            style={[styles.imageIcon, isSpeaker && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleMute}
          style={[
            styles.controlIconContainer,
            isMuted && { backgroundColor: '#5b5b5c' },
          ]}>
          <Image
            source={assets.microphone}
            style={[styles.imageIcon, isMuted && { tintColor: '#fff' }]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlIconContainer, { backgroundColor: '#fc2e50' }]}
          onPress={endCall}>
          <Image source={assets.endCall} style={styles.imageIcon} />
        </TouchableOpacity>
        {!isComInitiated && (
          <TouchableOpacity
            style={[
              styles.controlIconContainer,
              { backgroundColor: '#6abd6e' },
            ]}
            onPress={onAcceptCall}>
            <Image source={assets.phoneCall} style={styles.imageIcon} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default VideoChatView;
