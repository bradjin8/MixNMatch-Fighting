import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    storiesContainer: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      marginBottom: 5,
      flexDirection: 'row',
    },
    seenStyle: {
      borderColor: appStyles.colorSet[colorScheme].grey,
      borderWidth: 1,
    },
  });
};

export default dynamicStyles;
