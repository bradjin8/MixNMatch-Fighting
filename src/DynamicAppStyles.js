import { Platform, Dimensions, I18nManager } from 'react-native';
import invert from 'invert-color';
import { AppleButton } from '@invertase/react-native-apple-authentication';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const lightColorSet = {
  mainThemeBackgroundColor: '#ffffff',
  mainThemeForegroundColor: '#A01104',
  secondaryForegroundColor: '#f4f6fb',
  hairlineColor: '#d6d6d6',
  mainTextColor: '#232323',
  mainSubtextColor: '#7e7e7e',
  grayBgColor: '#f5f5f5',
  grey0: '#eaeaea',
  grey3: '#e6e6f2',
  grey6: '#d6d6d6',
  grey9: '#939393',
  whiteSmoke: '#f5f5f5',
  onlineMarkColor: '#41C61B',
  inputBgColor: '#eeeeee',
  inlineActionsColor: '#ffffee',
};

const darkColorSet = {
  mainThemeBackgroundColor: invert('#ffffff'),
  mainThemeForegroundColor: '#eb5a6d',
  secondaryForegroundColor: invert('#f4f6fb'),
  mainTextColor: invert('#464646'),
  mainSubtextColor: invert('#7e7e7e'),
  hairlineColor: invert('#d6d6d6'),
  grayBgColor: '#f5f5f5',
  grey0: invert('#eaeaea'),
  grey3: invert('#e6e6f2'),
  grey6: invert('#d6d6d6'),
  grey9: invert('#939393'),
  whiteSmoke: invert('#f5f5f5'),
  onlineMarkColor: '#41C61B',
  inputBgColor: invert('#eeeeee'),
  inlineActionsColor: invert('#ffffee'),
};

const _colorSet = {
  light: lightColorSet,
  dark: darkColorSet,
  'no-preference': lightColorSet,
  grayBgColor: '#f5f5f5',
  inputBgColor: '#eeeeee',
};

const navLight = {
  backgroundColor: '#fff',
  fontColor: '#000',
  headerStyleColor: '#E8E8E8',
  iconBackground: '#F4F4F4',
};

const navDark = {
  backgroundColor: invert('#fff'),
  fontColor: invert('#000'),
  headerStyleColor: invert('E8E8E8'),
  iconBackground: invert('#e6e6f2'),
};

const navThemeConstants = {
  light: navLight,
  dark: navDark,
  'no-preference': navLight,
  main: '#4991ec',
};

const _fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
};

const _sizeSet = {
  buttonWidth: '70%',
  inputWidth: '80%',
  radius: 50,
};

const _iconSet = {
  playButton: require('./CoreAssets/play-button.png'),
  logo: require('../assets/images/MNM_LOGO.png'),
  userAvatar: require('../assets/images/default-avatar.jpg'),
  backArrow: require('./CoreAssets/arrow-back-icon.png'),
  fireIcon: require('../assets/images/fire-icon.png'),
  userProfile: require('../assets/images/person-filled-icon.png'),
  conversations: require('../assets/images/chat-filled-icon.png'),
  BackgroundLayer: require('../assets/images/layerson2.png'),
  Dislike: require('../assets/images/dislike.png'),
  SuperLike: require('../assets/images/super_like.png'),
  Like: require('../assets/images/heart-filled-icon.png'),
  home: require('../assets/icons/home-icon.png'),
  add_user: require('../assets/icons/add-user-icon.png'),
  add_user_filled: require('../assets/icons/add-user-icon-filled.png'),
  camera_filled: require('../assets/icons/camera-filled-icon.png'),
  camera: require('../assets/icons/camera-icon.png'),
  chat: require('../assets/icons/chat-icon.png'),
  close: require('../assets/icons/close-x-icon.png'),
  checked: require('../assets/icons/checked-icon.png'),
  delete: require('../assets/icons/delete.png'),
  friends: require('../assets/icons/friends-icon.png'),
  inscription: require('../assets/icons/inscription-icon.png'),
  menu: require('../assets/icons/menu.png'),
  private_chat: require('../assets/icons/private-chat-icon.png'),
  search: require('../assets/icons/search-icon.png'),
  share: require('../assets/icons/share-icon.png'),
  vip: require('../assets/icons/vip.png'),
  logout: require('../assets/images/logout-menu-item.png'),
  instagram: require('../assets/images/icons8-instagram-100.png'),
  account: require('../assets/images/account-male-icon.png'),
  setting: require('../assets/images/settings-menu-item.png'),
  callIcon: require('../assets/images/contact-call-icon.png'),
  schoolIcon: require('../assets/images/educate-school-icon.png'),
  markerIcon: require('../assets/images/icons8-marker-500.png'),
  arrowdownIcon: require('../assets/images/arrow-down-icon.png'),
  boederImgSend: require('../assets/images/borderImg1.png'),
  boederImgReceive: require('../assets/images/borderImg2.png'),
  textBoederImgSend: require('../assets/images/textBorderImg1.png'),
  textBoederImgReceive: require('../assets/images/textBorderImg2.png'),
  starFilled: require('../assets/images/star-filled-icon2.png'),
  crossFilled: require('../assets/images/cross-filled-icon.png'),
  blockedUser: require('../assets/icons/blocked-user-64.png'),
};

const _styleSet = {
  menuBtn: {
    container: {
      backgroundColor: _colorSet.grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: 'black',
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1,
    },
    input: {
      backgroundColor: _colorSet.inputBgColor,
      borderRadius: 10,
      color: 'black',
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: lightColorSet.mainTextColor,
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
};

const appleButtonStyle = {
  dark: AppleButton?.Style?.WHITE,
  light: AppleButton?.Style?.BLACK,
  'no-preference': AppleButton?.Style?.WHITE,
};

const StyleDict = {
  navThemeConstants: navThemeConstants,
  colorSet: _colorSet,
  iconSet: _iconSet,
  sizeSet: _sizeSet,
  fontSet: _fontSet,
  styleSet: _styleSet,
  windowW: WINDOW_WIDTH,
  windowH: WINDOW_HEIGHT,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  appleButtonStyle,
};

export default StyleDict;
