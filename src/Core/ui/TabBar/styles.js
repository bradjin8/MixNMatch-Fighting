import { StyleSheet } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    tabBarContainer: {
      ...ifIphoneX(
        {
          height: 80,
        },
        {
          height: 45,
        },
      ),
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: appStyles.colorSet[colorScheme].hairlineColor,
    },
    tabContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabIcon: {
      ...ifIphoneX(
        {
          width: 25,
          height: 25,
        },
        {
          width: 22,
          height: 22,
        },
      ),
    },
    focusTintColor: {
      tintColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    unFocusTintColor: {
      tintColor: appStyles.colorSet[colorScheme].bottomTintColor,
    },
  });
};

export default dynamicStyles;
