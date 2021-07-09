import { Platform, StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',
      marginBottom: 4,
      flexDirection: 'row',
      height: 60,
    },
    cancelButtonText: {
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 16,
      marginBottom: 5,
    },
    searchInput: {
      fontSize: 14,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      backgroundColor:
        Platform.OS === 'ios'
          ? appStyles.colorSet[colorScheme].mainThemeBackgroundColor
          : appStyles.colorSet[colorScheme].whiteSmoke,
      flex: 1,
    },
  });
};

export default dynamicStyles;
