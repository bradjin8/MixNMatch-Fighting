import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-native-button';
import {
  AppState,
  Image,
  Keyboard,
  Platform,
  Text,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { setUserData } from '../redux/auth';
import { updateUser } from '../../api/firebase/auth';
import { IMDismissButton } from '../../truly-native';

const WelcomeScreen = (props) => {
  const currentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const appStyles = props?.appStyles
    ? props?.appStyles
    : props.route?.params?.appStyles;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const appConfig = props?.appConfig
    ? props?.appConfig
    : props.route?.params?.appConfig;
  const authManager = props?.authManager
    ? props?.authManager
    : props.route?.params?.authManager;

  const { title, caption } = props;

  useEffect(() => {
    registerOnNotificationOpenedApp();
    tryToLoginFirst();
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  const handleAppStateChange = async (nextAppState) => {
    const userID = currentUser?.id || currentUser?.userID;
    const intialNotification = await messaging().getInitialNotification();

    if (intialNotification && Platform.OS === 'android') {
      const {
        data: { channelID, type },
      } = intialNotification;

      if (type === 'chat_message') {
        handleChatMessageType(channelID);
      }
    }

    if (nextAppState === 'active' && userID && Platform.OS === 'ios') {
      updateUser(userID, { badgeCount: 0 });
    }
  };

  const tryToLoginFirst = async () => {
    authManager
      .retrievePersistedAuthUser(appConfig)
      .then((response) => {
        if (response?.user) {
          const user = response.user;
          dispatch(setUserData({
            user: response.user,
          }));
          Keyboard.dismiss();
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user: user } }],
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const registerOnNotificationOpenedApp = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      const {
        data: { channelID, type, name },
      } = remoteMessage;

      if (type === 'chat_message') {
        handleChatMessageType(channelID, name);
      }
    });
    messaging().onMessage((remoteMessage) => {
      if (remoteMessage && Platform.OS === 'ios') {
        const userID = currentUser?.id || currentUser?.userID;
        updateUser(userID, { badgeCount: 0 });
      }
    });
  };

  const handleChatMessageType = (channelID, name) => {
    const channel = {
      id: channelID,
      channelID,
      name,
    };

    props.navigation.navigate(
      'LoginStack',
      { screen: 'PersonalChat' },
      {
        params: {
          channel,
          appStyles,
          openedFromPushNotification: true,
        },
      },
    );
  };

  if (isLoading == true) {
    return <TNActivityIndicator appStyles={appStyles} />;
  }

  return (
    <View style={styles.container}>
      {props.delayedMode && (
        <IMDismissButton
          style={styles.dismissButton}
          tintColor={appStyles.colorSet[colorScheme].mainThemeForegroundColor}
          onPress={() => props.navigation.goBack()}
        />
      )}
      <View style={styles.logo}>
        <Image
          style={styles.logoImage}
          source={
            props.delayedMode
              ? appStyles.iconSet.delayedLogo
              : appStyles.iconSet.logo
          }
        />
      </View>
      <Text style={styles.title}>
        {title ? title : appConfig.onboardingConfig.welcomeTitle}
      </Text>
      <Text style={styles.caption}>
        {caption ? caption : appConfig.onboardingConfig.welcomeCaption}
      </Text>
      <Button
        containerStyle={styles.loginContainer}
        style={styles.loginText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('LoginStack', {
                screen: 'Sms',
                params: {
                  isSigningUp: false,
                  appStyles,
                  appConfig,
                  authManager,
                },
              })
            : props.navigation.navigate('LoginStack', {
                screen: 'Login',
                params: {
                  appStyles,
                  appConfig,
                  authManager,
                },
              });
        }}>
        {IMLocalized('Log In')}
      </Button>
      <Button
        containerStyle={styles.signupContainer}
        style={styles.signupText}
        onPress={() => {
          appConfig.isSMSAuthEnabled
            ? props.navigation.navigate('LoginStack', {
                screen: 'Sms',
                params: {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                  authManager,
                },
              })
            : props.navigation.navigate('LoginStack', {
                screen: 'Signup',
                params: {
                  appStyles,
                  appConfig,
                  authManager,
                },
              });
        }}>
        {IMLocalized('Sign Up')}
      </Button>
    </View>
  );
};

export default WelcomeScreen;
