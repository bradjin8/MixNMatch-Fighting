import { StyleSheet, Dimensions } from 'react-native';

const height = Dimensions.get('window').height;
const tickContainerSize = 24;
const containerPaddingHorizontal = 20;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appStyles.colorSet[colorScheme].secondaryForegroundColor,
    },
    carouselContainer: {
      flex: 1.7,
      paddingHorizontal: containerPaddingHorizontal,
    },
    carouselImageContainer: {
      flex: 1,
    },
    carouselImage: {
      height: '82%',
      width: '100%',
    },
    inactiveDot: {
      backgroundColor: 'rgba(0,0,0,.3)',
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      width: 6,
      height: 6,
      borderRadius: 3,
      marginLeft: 3,
      marginRight: 3,
    },
    subscriptionsContainer: {
      flex: 2.5,
      alignItems: 'center',
    },
    headerTitle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      textAlign: 'center',
      fontSize: 26,
      paddingBottom: 3,
      paddingHorizontal: containerPaddingHorizontal,
    },
    titleDescription: {
      color: appStyles.colorSet[colorScheme].mainSubtextColor,
      textAlign: 'center',
      fontSize: 13,
      lineHeight: 18,
      paddingHorizontal: containerPaddingHorizontal - 5,
    },
    subscriptionPlansContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      paddingHorizontal: containerPaddingHorizontal - 7,
    },
    subscriptionContainer: {
      flexDirection: 'row',
      flex: 0.3,
      // height: Math.floor(height * 0.11),
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      borderRadius: Math.floor(height * 0.02),
      paddingVertical: 8,
      paddingHorizontal: 6,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,

      elevation: 4,
    },
    selectContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingRight: 10,
    },
    tickIconContainer: {
      width: tickContainerSize,
      height: tickContainerSize,
      borderRadius: Math.floor(tickContainerSize / 2),
      backgroundColor: '#f4f6fa',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedSubscription: {
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    tick: {
      width: tickContainerSize - 10,
      height: tickContainerSize - 10,
      tintColor: '#fff',
    },
    rateContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    rateText: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    monthText: {
      fontSize: 12,
      color: appStyles.colorSet[colorScheme].mainTextColor,
    },
    trialOptionContainer: {
      flex: 2,
      justifyContent: 'center',
    },
    trialContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Math.floor(height * 0.92),
      marginHorizontal: 15,
      height: '65%',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    trialText: {
      fontSize: 16,
      color: '#fff',
    },
    bottomContainer: {
      flex: 1.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomHeaderTitle: {
      color: appStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
    bottomButtonContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      width: '80%',
      height: '24%',
      borderRadius: Math.floor(height * 0.92),
      marginTop: 20,
    },
    buttonTitle: {
      fontSize: 16,
      color: '#fff',
    },
    cancelTitle: {
      fontSize: 16,
      color: appStyles.colorSet[colorScheme].mainThemeForegroundColor,
      padding: 15,
      marginBottom: 7,
    },
  });
};

export default dynamicStyles;
