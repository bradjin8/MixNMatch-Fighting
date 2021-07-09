/** @format */

import { AppRegistry, Platform, NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import RNCallKeep from 'react-native-callkeep';

const { LaunchManager } = NativeModules;

const options = {
  ios: {
    appName: 'Instachatty',
  },
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
  },
};

RNCallKeep.setup(options);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('xxxxxxx ' + JSON.stringify(remoteMessage));
  presentIncomingCall(remoteMessage);
});

presentIncomingCall = async (remoteMessage) => {
  if (Platform.OS != 'android') {
    return;
  }
  // const options = {
  //   ios: {
  //     appName: 'Instachatty',
  //   },
  //   android: {
  //     alertTitle: 'Permissions required',
  //     alertDescription: 'This application needs to access your phone accounts',
  //     cancelButton: 'Cancel',
  //     okButton: 'ok',
  //   },
  // };

  try {
    //   RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);

    RNCallKeep.addEventListener('answerCall', (body) =>
      onAnswerCallAction(body, remoteMessage.data),
    );

    const { callID, callerName } = remoteMessage.data;
    console.log(callerName);
    RNCallKeep.displayIncomingCall(callID, callerName, callerName);
  } catch (error) {
    console.log(error);
  }
};

onAnswerCallAction = async (body, data) => {
  await RNCallKeep.removeEventListener('endCall');
  console.log('onAnswerCallAction ' + body.callUUID);
  RNCallKeep.rejectCall(body.callUUID);

  LaunchManager.openAppWithData(JSON.stringify(data));
};

AppRegistry.registerComponent(appName, () => App);
