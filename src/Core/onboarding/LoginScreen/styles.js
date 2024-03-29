import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';
import { modedColor } from '../../helpers/colors';
import TNColor from '../../truly-native/TNColor';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    orTextStyle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      marginTop: 40,
      marginBottom: 10,
      alignSelf: 'center',
    },
    title: {
      fontSize: 30,
      fontWeight: 'normal',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      marginTop: 25,
      marginBottom: 20,
      alignSelf: 'stretch',
      textAlign: 'left',
      marginLeft: 30,
    },
    loginContainer: {
      width: '70%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 30,
      padding: 20,
      marginTop: 50,
      alignSelf: 'center',
    },
    loginText: {
      fontWeight: 'bold',
      color: '#ffffff',
    },
    placeholder: {
      color: 'red',
    },
    InputContainer: {
      height: 42,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: appStyles.colorSet[colorScheme].grey3,
      backgroundColor: modedColor(
        appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        TNColor('#e0e0e0'),
      ),
      paddingLeft: 20,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      width: '80%',
      alignSelf: 'center',
      marginTop: 20,
      alignItems: 'center',
      borderRadius: 0,
      textAlign: I18nManager.isRTL ? 'right' : 'left',
    },

    facebookContainer: {
      width: '70%',
      backgroundColor: '#4267B2',
      borderRadius: 25,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
    },
    appleButtonContainer: {
      width: '70%',
      height: 40,
      marginTop: 16,
      alignSelf: 'center',
    },
    facebookText: {
      color: '#ffffff',
      fontSize: 14,
    },
    phoneNumberContainer: {
      marginTop: 20,
    },
    forgotPasswordContainer: {
      marginTop: 50,
      width: '80%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    forgotPasswordText: {
      fontSize: 14,
      padding: 4,
      // backgroundColor: '#ddd',
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      borderStyle: 'solid',
      borderBottomWidth: 2,
      borderBottomColor: appStyles.colorSet[colorScheme].mainSubtextColor,
    },
  });
};

export default dynamicStyles;
