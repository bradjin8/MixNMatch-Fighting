import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      textAlign: 'center',
      paddingBottom: 25,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    text: {
      fontSize: 18,
      textAlign: 'center',
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      paddingLeft: 10,
      paddingRight: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 60,
      tintColor: 'white',
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    backgroundImage: {
      flex: 1,
      top: '-36%',
      height: '100%',
      width: '100%',
      // justifyContent: 'flex-end',
      // alignItems: 'center',
    },
    descriptionContainer: {
      top: '-25%',
      // flex: 0.4,
      // marginTop: '100%'
    },
    button: {
      fontSize: 18,
      color: 'white',
      marginTop: 10,
    },
    dot: {
      backgroundColor: 'rgba(187,187,187,0.3)',
      top: '-20%'
    },
    activeDot: {
      backgroundColor: '#BBBBBB',
      top: '-20%'
    }
  });
};

export default dynamicStyles;
