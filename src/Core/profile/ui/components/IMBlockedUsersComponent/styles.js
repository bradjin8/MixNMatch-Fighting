import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      paddingTop: 10,
    },
    listItem: {
      margin: 10,
      padding: 10,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      width: '90%',
      flex: 1,
      alignSelf: 'center',
      flexDirection: 'row',
      borderRadius: 20,
      shadowColor: appStyles.colorSet[colorScheme].grey,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    profilePicture: {
      width: 60,
      height: 60,
      borderRadius: 30,
      alignSelf: 'center',
    },
    centerItem: {
      padding: 10,
      alignItems: 'center',
      flexDirection: 'column',
      flex: 1,
    },
    text: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      // fontWeight: '500',
      fontSize: appStyles.fontSet.normal,
      marginVertical: 5,
    },
    buttonOpacity: {
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      marginVertical: 20,
      height: 35,
      width: 75,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 30,
      shadowColor: appStyles.colorSet[colorScheme].grey,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    button: {
      fontWeight: 'bold',
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
  });
};

export default dynamicStyles;
