import { StyleSheet } from 'react-native';

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
      margin: 8,
      paddingLeft: 8,
      borderRadius: 12,
      height: 37,
    },
    searchIcon: {
      height: 15,
      width: 15,
      tintColor: appStyles.colorSet[colorScheme].grey,
      marginRight: 1,
    },
    searchInput: {
      padding: 4,
      paddingLeft: 4,
      fontSize: 15,
      color: appStyles.colorSet[colorScheme].grey,
      backgroundColor: appStyles.colorSet[colorScheme].whiteSmoke,
    },
  });
};

export default dynamicStyles;
