import { StyleSheet, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;

const mentionItemContainerHeight = Math.floor(height * 0.066);
const mentionPhotoSize = Math.floor(mentionItemContainerHeight * 0.66);

const dynamicStyles = (colorScheme, appStyles) => {
  return new StyleSheet.create({
    mentionItemContainer: {
      width: ' 100%',
      height: mentionItemContainerHeight,
      alignSelf: 'center',
      padding: 10,
      alignItems: 'center',
      flexDirection: 'row',
    },
    mentionPhotoContainer: {
      flex: 0.8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    mentionPhoto: {
      height: mentionPhotoSize,
      borderRadius: mentionPhotoSize / 2,
      width: mentionPhotoSize,
    },
    mentionNameContainer: {
      flex: 6,
      height: '100%',
      justifyContent: 'center',
      borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderBottomWidth: 0.5,
    },
    mentionName: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontWeight: '400',
    },
  });
};

export default dynamicStyles;
