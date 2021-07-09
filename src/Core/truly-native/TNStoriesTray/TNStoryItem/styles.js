import { StyleSheet } from 'react-native';

const imageContainerWidth = 66;
const imageWidth = imageContainerWidth - 6;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      margin: 8,
      overflow: 'hidden',
    },
    imageContainer: {
      width: imageContainerWidth,
      height: imageContainerWidth,
      borderRadius: Math.floor(imageContainerWidth / 2),
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: imageWidth,
      height: imageWidth,
      borderRadius: Math.floor(imageWidth / 2),
      borderColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderWidth: 1,
      overflow: 'hidden',
    },
    text: {
      fontSize: 12,
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      paddingTop: 5,
    },
    isOnlineIndicator: {
      position: 'absolute',
      backgroundColor: '#4acd1d',
      height: 16,
      width: 16,
      borderRadius: 16 / 2,
      borderWidth: 3,
      borderColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      right: 5,
      bottom: 0,
    },
  });
};

export default dynamicStyles;
