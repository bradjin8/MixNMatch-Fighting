import { StyleSheet } from 'react-native';

const VIEW_WIDTH = 60;
const MULTI_ICON_WIDTH = 40;
const RADIUS_BORDER_WIDTH = 2;
const TOP_ICON_WIDTH = MULTI_ICON_WIDTH + RADIUS_BORDER_WIDTH * 2;
const ONLINE_MARK_WIDTH = 9 + RADIUS_BORDER_WIDTH * 2;

const dynamicStyles = (appStyles, colorScheme) => {
  return StyleSheet.create({
    container: {},
    singleParticipation: {
      height: VIEW_WIDTH,
      width: VIEW_WIDTH,
    },
    singleChatItemIcon: {
      position: 'absolute',
      height: VIEW_WIDTH,
      borderRadius: VIEW_WIDTH / 2,
      width: VIEW_WIDTH,
      left: 0,
      top: 0,
    },
    onlineMark: {
      position: 'absolute',
      backgroundColor: '#4acd1d',
      height: ONLINE_MARK_WIDTH,
      width: ONLINE_MARK_WIDTH,
      borderRadius: ONLINE_MARK_WIDTH / 2,
      borderWidth: RADIUS_BORDER_WIDTH,
      borderColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      right: 1.5,
      bottom: 1,
    },
    multiParticipation: {
      height: VIEW_WIDTH,
      width: VIEW_WIDTH,
    },
    bottomIcon: {
      top: 0,
      right: 0,
    },
    topIcon: {
      left: 0,
      bottom: 0,
      height: TOP_ICON_WIDTH,
      width: TOP_ICON_WIDTH,
      borderRadius: TOP_ICON_WIDTH / 2,
      borderWidth: RADIUS_BORDER_WIDTH,
      borderColor: appStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    multiPaticipationIcon: {
      position: 'absolute',
      height: MULTI_ICON_WIDTH,
      borderRadius: MULTI_ICON_WIDTH / 2,
      width: MULTI_ICON_WIDTH,
    },
    multiPaticipationIcon: {
      position: 'absolute',
      height: MULTI_ICON_WIDTH,
      borderRadius: MULTI_ICON_WIDTH / 2,
      width: MULTI_ICON_WIDTH,
    },
  });
};

export default dynamicStyles;
