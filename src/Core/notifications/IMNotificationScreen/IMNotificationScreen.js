import React, { useEffect, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import IMNotification from '../Notification/IMNotification';
import { firebaseNotification } from '../../notifications';
import { setNotifications } from '../redux';
import { Appearance } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';

const IMNotificationScreen = (props) => {
  const COLOR_SCHEME = Appearance.getColorScheme();
  const appStyles = props.route.params.appStyles;
  let currentTheme = appStyles.navThemeConstants[COLOR_SCHEME];
  const user = useSelector((state) => state.auth.user);
  const notifications = useSelector(
    (state) => state.notifications.notifications,
  );
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: IMLocalized('Notifications'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [dispatch]);

  useEffect(() => {
    let didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          props.onBackButtonPressAndroid,
        ),
    );

    const lastScreenTitle = props.route.params.lastScreenTitle;
    if (!lastScreenTitle) {
      lastScreenTitle = 'Profile';
    }

    let willBlurSubscription = props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );
    const notificationUnsubscribe = firebaseNotification.subscribeNotifications(
      user.id,
      onNotificationCollection,
    );

    return () => {
      notificationUnsubscribe();
      didFocusSubscription && didFocusSubscription();
      willBlurSubscription && willBlurSubscription();
    };
  }, []);

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };

  const onNotificationCollection = (notifications) => {
    dispatch(setNotifications(notifications));
  };

  const onNotificationPress = async (notification) => {
    firebaseNotification.updateNotification({
      ...notification,
      seen: true,
    });
  };

  const emptyStateConfig = {
    title: IMLocalized('No Notifications'),
    description: IMLocalized(
      'You currently do not have any notifications. Your notifications will show up here.',
    ),
  };

  return (
    <IMNotification
      onNotificationPress={onNotificationPress}
      notifications={notifications}
      appStyles={appStyles}
      emptyStateConfig={emptyStateConfig}
    />
  );
};

export default IMNotificationScreen;
