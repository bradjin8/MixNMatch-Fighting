import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  Alert,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput';
import {
  KeyboardAccessoryView,
  KeyboardTrackingView,
} from 'react-native-ui-lib/keyboard';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';
import './BottomAudioRecorder';

const assets = {
  cameraFilled: require('../assets/camera-filled.png'),
  send: require('../assets/send.png'),
  mic: require('../assets/microphone.png'),
  close: require('../assets/close-x-icon.png'),
};

function BottomInput(props) {
  const {
    value,
    onChangeText,
    onAudioRecordDone,
    onSend,
    onAddMediaPress,
    uploadProgress,
    appStyles,
    inReplyToItem,
    onReplyingToDismiss,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const textInputRef = useRef(null);
  const [customKeyboard, setCustomKeyboard] = useState({
    component: undefined,
    initialProps: undefined,
  });

  useEffect(() => {
    // textInputRef.current?.focus();
  }, []);

  const isDisabled = () => {
    if (/\S/.test(value)) {
      return false;
    } else {
      return true;
    }
  };

  const onKeyboardResigned = () => {
    resetKeyboardView();
  };

  const resetKeyboardView = () => {
    setCustomKeyboard({});
  };

  const onVoiceRecord = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (response.status === 'granted') {
      showKeyboardView('BottomAudioRecorder');
    } else {
      Alert.alert(
        IMLocalized('Audio permission denied'),
        IMLocalized(
          'You must enable audio recording permissions in order to send a voice note.',
        ),
      );
    }
  };

  const showKeyboardView = (component) => {
    setCustomKeyboard({
      component,
      initialProps: { appStyles },
    });
  };

  const onCustomKeyboardItemSelected = (keyboardId, params) => {
    onAudioRecordDone(params);
  };

  const renderBottomInput = () => {
    return (
      <View style={styles.bottomContentContainer}>
        {inReplyToItem && (
          <View style={styles.inReplyToView}>
            <Text style={styles.replyingToHeaderText}>
              {IMLocalized('Replying to')}{' '}
              <Text style={styles.replyingToNameText}>
                {inReplyToItem.senderFirstName || inReplyToItem.senderLastName}
              </Text>
            </Text>
            <Text style={styles.replyingToContentText}>
              {inReplyToItem.content}
            </Text>
            <TouchableHighlight
              style={styles.replyingToCloseButton}
              onPress={() => onReplyingToDismiss && onReplyingToDismiss()}>
              <Image source={assets.close} style={styles.replyingToCloseIcon} />
            </TouchableHighlight>
          </View>
        )}
        <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
        <View style={styles.inputBar}>
          <TouchableOpacity
            onPress={onAddMediaPress}
            style={styles.inputIconContainer}>
            <Image style={styles.inputIcon} source={assets.cameraFilled} />
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={onVoiceRecord}
              style={styles.micIconContainer}>
              <Image style={styles.micIcon} source={assets.mic} />
            </TouchableOpacity>
            <AutoGrowingTextInput
              maxHeight={100}
              style={styles.input}
              ref={textInputRef}
              value={value}
              multiline={true}
              placeholder={IMLocalized('Start typing...')}
              placeholderTextColor={
                appStyles.colorSet[colorScheme].mainSubtextColor
              }
              underlineColorAndroid="transparent"
              onChangeText={(text) => onChangeText(text)}
              onFocus={resetKeyboardView}
            />
          </View>
          <TouchableOpacity
            disabled={isDisabled()}
            onPress={onSend}
            style={[
              styles.inputIconContainer,
              isDisabled() ? { opacity: 0.2 } : { opacity: 1 },
            ]}>
            <Image style={styles.inputIcon} source={assets.send} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAccessoryView
      renderContent={renderBottomInput}
      useSafeArea={false}
      kbInputRef={textInputRef}
      kbComponent={customKeyboard.component}
      kbInitialProps={customKeyboard.initialProps}
      onItemSelected={onCustomKeyboardItemSelected}
      onKeyboardResigned={onKeyboardResigned}
      manageScrollView={false}
      requiresSameParentToManageScrollView={true}
      revealKeyboardInteractive={true}
    />
  );
}

export default BottomInput;
