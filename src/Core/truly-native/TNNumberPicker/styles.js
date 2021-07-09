import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  const colorSet = appStyles.colorSet[colorScheme];

  return StyleSheet.create({
    containerView: {
      backgroundColor: colorSet.mainThemeBackgroundColor,
      flex: 1,
      flexDirection: 'row',
    },
    buttonContainer: {
      marginLeft: 20,
      marginRight: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colorSet.mainTextColor,
    },
    buttonImage: {
      width: 32,
      height: 32,
      tintColor: colorSet.mainThemeForegroundColor,
    },
  });
};

export default dynamicStyles;
