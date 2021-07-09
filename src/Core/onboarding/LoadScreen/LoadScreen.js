import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import deviceStorage from '../utils/AuthDeviceStorage';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/auth';

const LoadScreen = (props) => {
  const { navigation, route } = props;

  const dispatch = useDispatch();

  const appStyles = route.params.appStyles;
  const appConfig = route.params.appConfig;
  const authManager = props?.authManager
  ? props?.authManager
  : props.route?.params?.authManager;

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setAppState();
    }),
  );

  useEffect(() => {
    setAppState();
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  const setAppState = async () => {
    const shouldShowOnboardingFlow = await deviceStorage.getShouldShowOnboardingFlow();
    if (!shouldShowOnboardingFlow) {
      if (appConfig.isDelayedLoginEnabled) {
        fetchPersistedUserIfNeeded()
        return;
      }
      navigation.navigate('LoginStack', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    } else {
      navigation.navigate('Walkthrough', {
        appStyles: appStyles,
        appConfig: appConfig,
      });
    }
  };

  const fetchPersistedUserIfNeeded = async () => {
    authManager
      .retrievePersistedAuthUser(appConfig)
      .then((response) => {
        if (response?.user) {
          dispatch(setUserData({
            user: response.user
          }));
          Keyboard.dismiss();
        }
        navigation.navigate('DelayedHome');  
      })
      .catch((error) => {
        console.log(error);
        navigation.navigate('DelayedHome');  
      });
  };


  return <View />;
};

LoadScreen.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
};

LoadScreen.navigationOptions = {
  header: null,
};

export default LoadScreen;
