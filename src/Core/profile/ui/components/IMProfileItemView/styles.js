import { StyleSheet } from 'react-native';
import { I18nManager } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 50,
      width: '95%',
    },
    icon: {
      width: 24,
      height: 24,
    },
    itemContainer: {
      flex: 1,
      flexDirection: 'row',
      height: '100%',
      marginLeft: 10,
    },
    title: {
      marginLeft: 15,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 14,
      marginTop: 3,
    },
    itemNavigationIcon: {
      height: 20,
      width: 20,
      marginRight: 10,
      tintColor: appStyles.colorSet[colorScheme].grey6,
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
    },
  });
};

export default dynamicStyles;
