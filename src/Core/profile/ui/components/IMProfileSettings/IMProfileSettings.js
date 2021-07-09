import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { authManager } from '../../../../onboarding/utils/api';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../../localization/IMLocalization';

function IMProfileSettings(props) {
  const { navigation, onLogout, lastScreenTitle, appStyles, appConfig } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const currentUser = useSelector((state) => state.auth.user);

  const onSettingsTypePress = async (
    type,
    routeName,
    form,
    screenTitle,
    phone,
  ) => {
    if (type === 'Logout') {
      authManager.logout(currentUser);
      onLogout();
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoadScreen',
            params: { appStyles: appStyles, appConfig: appConfig },
          },
        ],
      });
    } else {
      navigation.navigate(lastScreenTitle + routeName, {
        appStyles: appStyles,
        form,
        screenTitle,
        phone,
      });
    }
  };

  const renderSettingsType = ({
    type,
    routeName,
    form,
    screenTitle,
    phone,
  }) => (
    <TouchableOpacity
      style={styles.settingsTypeContainer}
      onPress={() => onSettingsTypePress(type, routeName, form, screenTitle)}>
      <Text style={styles.settingsType}>{type}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingsTitleContainer}>
        <Text style={styles.settingsTitle}>{'GENERAL'}</Text>
      </View>
      <View style={styles.settingsTypesContainer}>
        {renderSettingsType({
          type: 'Account Details',
          routeName: 'EditProfile',
          form: appConfig.editProfileFields,
          screenTitle: IMLocalized('Edit Profile'),
        })}
        {renderSettingsType({
          type: 'Blocked Users',
          routeName: 'BlockedSettings',
          screenTitle: IMLocalized('Blocked Users'),
        })}
        {renderSettingsType({
          type: 'Settings',
          routeName: 'AppSettings',
          form: appConfig.userSettingsFields,
          screenTitle: IMLocalized('User Settings'),
        })}
        {renderSettingsType({
          type: 'Contact Us',
          routeName: 'ContactUs',
          form: appConfig.contactUsFields,
          phone: appConfig.contactUsPhoneNumber,
          screenTitle: IMLocalized('Contact Us'),
        })}
        {renderSettingsType({ type: 'Logout' })}
      </View>
    </View>
  );
}

IMProfileSettings.propTypes = {};

export default IMProfileSettings;
