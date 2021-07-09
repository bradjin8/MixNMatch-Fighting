import { StyleSheet } from 'react-native';

const imageSize = 40;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    userImageMainContainer: {
      flex: 1,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 7,
    },
    userImageContainer: {
      width: imageSize,
      height: imageSize,
      borderWidth: 0,
      alignItems: 'flex-end',
    },
    userImage: {
      width: imageSize,
      height: imageSize,
    },
    notificationItemBackground: {
      flex: 1,
    },
    notificationItemContainer: {
      flexDirection: 'row',
      width: '95%',
      height: 82,
      alignSelf: 'center',
      borderBottomColor: appStyles.colorSet[colorScheme].hairlineColor,
      borderBottomWidth: 0.3,
    },
    notificationLabelContainer: {
      flex: 5.4,
      justifyContent: 'center',
    },
    description: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 12,
      paddingVertical: 6,
    },
    name: {
      fontWeight: '700',
    },
    moment: {
      fontSize: 10,
    },
    seenNotificationBackground: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    unseenNotificationBackground: {
      backgroundColor: appStyles.colorSet[colorScheme].mainButtonColor,
    },
    emptyStateView: {
      marginTop: 120,
    },
  });
};

export default dynamicStyles;
