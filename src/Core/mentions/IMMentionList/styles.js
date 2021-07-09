import { StyleSheet } from 'react-native';

const dynamicStyles = (colorScheme, appStyles) => {
  return new StyleSheet.create({
    usersMentionContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
    },
    usersMentionScrollContainer: {
      flex: 1,
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
};

export default dynamicStyles;
