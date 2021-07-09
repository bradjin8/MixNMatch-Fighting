import { StyleSheet } from 'react-native';
import { Appearance } from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const styles = (appStyles) => {
  return new StyleSheet.create({
    tnCardContainer: {
      flex: 1,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      paddingBottom: 15,
      paddingTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
    },
    tnCardShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
};

export default styles;
