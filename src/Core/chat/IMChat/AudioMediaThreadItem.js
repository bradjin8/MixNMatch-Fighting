import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { Audio } from 'expo-av';
import Slider from 'react-native-slider';
import { loadCachedItem } from '../../helpers/cacheManager';
import dynamicStyles from './styles';

const assets = {
  play: require('../assets/play.png'),
  pause: require('../assets/pause.png'),
};

export default function AudioMediaThreadItem(props) {
  const { appStyles, item, outBound } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme, outBound);

  const [volume, setVolume] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [soundPosition, setSoundPosition] = useState(null);
  const [soundDuration, setSoundDuration] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlaybackAllowed, setIsPlaybackAllowed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const soundRef = useRef(null);
  const shouldPlay = useRef(false);
  const isSeeking = useRef(false);
  const shouldPlayAtEndOfSeek = useRef(false);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const loadCachedAudio = async () => {
    setIsLoading(true);
    const path = await loadCachedItem({ uri: item.url });
    return loadAudio(path);
  };

  const loadAudio = async (path) => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: false,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: false,
    });

    soundRef.current = new Audio.Sound();

    soundRef.current.setOnPlaybackStatusUpdate(updateScreenForSoundStatus);
    try {
      await soundRef.current.loadAsync(
        {
          uri: path,
        },
        {
          isLooping: false,
          isMuted: false,
          volume: volume,
          rate: rate,
          shouldCorrectPitch: true,
        },
      );

      setIsLoading(false);
      // sound can play!
    } catch (error) {
      // An error occurred!
    }
  };

  const stopPlayback = async () => {
    if (soundRef.current !== null && !isLoading) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current.setOnPlaybackStatusUpdate(null);
      soundRef.current = null;
      setSoundPosition(null);
    }
  };

  const updateScreenForSoundStatus = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setSoundDuration(status.durationMillis);
      setSoundPosition(status.positionMillis);
      setVolume(status.volume);
      setRate(status.rate);
      setIsPlaybackAllowed(true);
      shouldPlay.current = status.shouldPlay;
    } else {
      setSoundDuration(null);
      setSoundPosition(null);
      setIsPlaybackAllowed(false);

      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  const getMMSSFromMillis = (millis) => {
    if (!millis) {
      return '';
    }
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  };

  const getPlaybackTimestamp = (position, duration) => {
    if (soundRef.current != null && position != null && duration != null) {
      if (!shouldPlay.current) {
        return `${getMMSSFromMillis(duration)}`;
      }
      return `${getMMSSFromMillis(position)}`;
    }
    return '';
  };

  const onPlayPausePressed = async () => {
    if (soundRef.current != null) {
      if (soundDuration === soundPosition) {
        soundRef.current.replayAsync();
        return;
      }
      if (isPlaying) {
        soundRef.current.pauseAsync();
      } else {
        soundRef.current.playAsync();
      }
    } else {
      await loadCachedAudio();
      await soundRef.current.playAsync();
    }
  };

  const onSeekSliderValueChange = (value) => {
    if (soundRef.current != null && !isSeeking.current) {
      isSeeking.current = true;
      shouldPlayAtEndOfSeek.current = shouldPlay.current;
      soundRef.current.pauseAsync();
    }
  };

  const onSeekSliderSlidingComplete = async (value, duration) => {
    if (soundRef.current != null) {
      isSeeking.current = false;
      const seekPosition = value * duration;
      if (shouldPlayAtEndOfSeek.current) {
        soundRef.current.playFromPositionAsync(seekPosition);
      } else {
        soundRef.current.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekSliderPosition = (position, duration) => {
    if (soundRef.current != null && position != null && duration != null) {
      return position / duration;
    }
    return 0;
  };

  return (
    <View style={styles.audioMediaThreadItemContainer}>
      <TouchableOpacity
        disabled={isLoading}
        onPress={onPlayPausePressed}
        style={styles.audioPlayPauseIconContainer}>
        <View style={styles.playPauseIconContainer}>
          <Image
            style={[
              styles.audioPlayIcon,
              isPlaying ? { marginLeft: 0 } : { marginLeft: 2 },
            ]}
            source={isPlaying ? assets.pause : assets.play}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.audioMeterContainer}>
        <Slider
          style={styles.audioMeter}
          thumbStyle={styles.audioMeterThumb}
          value={getSeekSliderPosition(soundPosition, soundDuration)}
          step={getSeekSliderPosition(soundPosition, soundDuration)}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={(value) =>
            onSeekSliderSlidingComplete(value, soundDuration)
          }
          // maximumTrackTintColor={styles.maximumAudioTrackTintColor.color}
          minimumTrackTintColor={styles.minimumAudioTrackTintColor.color}
          thumbTintColor={styles.audioThumbTintColor.color}
          disabled={isLoading}
        />
      </View>
      <View style={styles.audioTimerContainer}>
        {isLoading ? (
          <ActivityIndicator color={styles.minimumAudioTrackTintColor.color} />
        ) : (
          <Text style={styles.audioTimerCount}>
            {soundRef.current !== null
              ? getPlaybackTimestamp(soundPosition, soundDuration)
              : getMMSSFromMillis(item.duration)}
          </Text>
        )}
      </View>
    </View>
  );
}
