import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IMProfileSettings from '../components/IMProfileSettings/IMProfileSettings';
import { logout } from '../../../onboarding/redux/auth';
import { IMLocalized } from '../../../localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';

const IMProfileSettingsScreen = (props) => {
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles.navThemeConstants[colorScheme];
  const navigation = props.navigation;
  const appConfig = props.route.params.appConfig;
  const lastScreenTitle = props.route.params?.lastScreenTitle
    ? props.route.params?.lastScreenTitle
    : 'Profile';

  const currentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: IMLocalized('Settings'),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, []);

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <IMProfileSettings
      navigation={props.navigation}
      onLogout={onLogout}
      lastScreenTitle={lastScreenTitle}
      user={currentUser}
      appStyles={appStyles}
      appConfig={appConfig}
    />
  );
};

export default IMProfileSettingsScreen;
