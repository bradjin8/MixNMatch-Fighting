import { StyleSheet, Dimensions, I18nManager } from 'react-native';
import { modedColor } from '../../helpers/colors';
import TNColor from '../../truly-native/TNColor';

const { height, width } = Dimensions.get('window');

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },

    sportsContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: width,
      height: height * 0.62,
    },
    sportsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      height: height * 0.3,
      width: width,
      marginVertical: 5
    },
    sportsImage: {
      height: height * 0.3,
      width: width * 0.45,
      marginHorizontal: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 20,
      borderRadius: 15,
    },
    sportsImageActive: {
      borderWidth: 3,
      borderColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    sportsName: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      shadowColor: 'black',
      shadowOpacity: 0.8,
      shadowRadius: 3,
      shadowOffset: {width: 5, height: 5},
    },
    chooseText: {
      fontSize: 18,
      color: 'grey',
      fontWeight: 'bold',
      marginTop: 50,
    },
    continueContainer: {
      alignSelf: 'center',
      width: appStyles.sizeSet.buttonWidth,
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      borderRadius: 30,
      padding: 20,
      marginTop: 30,
    },
    continueText: {
      fontWeight: 'bold',
      fontSize: 20,
      color: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
  });
};

export default dynamicStyles;
