import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  const colorSet = appStyles.colorSet[colorScheme];
  const fontSet = appStyles.fontFamily;
  return new StyleSheet.create({
    btnClickContain: {
      flexDirection: 'row',
      padding: 5,
      marginTop: 0,
      marginBottom: 0,
      backgroundColor: colorSet.whiteSmoke,
    },
    btnContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colorSet.whiteSmoke,
      padding: 7,
    },
    btnIcon: {
      tintColor: colorSet.mainTextColor,
      height: 30,
      width: 30,
    },
    btnText: {
      fontFamily: fontSet.main,
      fontWeight: 'bold',
      marginLeft: 20,
      marginTop: 5,
      color: colorSet.mainTextColor,
    },
  });
};

export default dynamicStyles;
