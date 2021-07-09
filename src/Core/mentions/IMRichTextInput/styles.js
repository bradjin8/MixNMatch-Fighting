import { StyleSheet, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;

const dynamicStyles = (colorScheme, appStyles) => {
  return new StyleSheet.create({
    container: {
      width: width,
      height: '100%',
    },
    editorContainer: {
      height: '100%',
    },
    textContainer: {
      alignSelf: 'stretch',
      position: 'relative',
      minHeight: 40,
      maxHeight: 140,
    },
    input: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontWeight: '400',
      paddingHorizontal: 20,
      minHeight: 40,
      position: 'absolute',
      top: 0,
      color: 'transparent',
      alignSelf: 'stretch',
      width: '100%',
      height: '100%',
    },
    formmatedTextWrapper: {
      minHeight: 40,
      position: 'absolute',
      top: 0,
      paddingHorizontal: 20,
      paddingVertical: 5,
      width: '100%',
    },
    formmatedText: {
      fontSize: 16,
      fontWeight: '400',
    },
    mention: {
      fontSize: 16,
      fontWeight: '400',
      backgroundColor: 'rgba(36, 77, 201, 0.05)',
      color: '#244dc9',
    },
    placeholderText: {
      color: 'rgba(0, 0, 0, 0.1)',
      fontSize: 16,
    },
  });
};

export const mentionStyle = {
  mention: {
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: 'rgba(36, 77, 201, 0.05)',
    color: '#244dc9',
  },
};

export default dynamicStyles;
