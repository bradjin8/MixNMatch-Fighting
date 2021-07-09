import { StyleSheet, Dimensions } from 'react-native';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const controlIconSize = HEIGHT * 0.063;
const avatarMultiSize = WIDTH * 0.28;
const avatarSingleSize = WIDTH * 0.3;

const styles = StyleSheet.create({
  callerNameContainer: {
    position: 'absolute',
    top: '20%',
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  callerName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  callTitle: {
    marginTop: 10,
    color: '#fff',
    fontSize: 13,
  },
  largeFillingRtcContainer: {
    overflow: 'hidden',
    backgroundColor: 'black',
    zIndex: 0,
    ...StyleSheet.absoluteFill,
  },
  groupSmallLocalRtcContainer: {
    backgroundColor: 'black',
    width: '22%',
    height: '70%',
    zIndex: 3,
    borderRadius: 10,
    marginLeft: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  singleSmallLocalRtcContainer: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 15,
    right: 15,
    width: '22%',
    height: '15%',
    zIndex: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  remoteStreamsContainer: {
    position: 'absolute',
    top: 15,
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    width: '98%',
    height: '25%',
    zIndex: 3,
  },
  rtcStream: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
  },
  localStream: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  control: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: '7%',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 2,
  },
  controlIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: controlIconSize,
    width: controlIconSize,
    borderRadius: controlIconSize / 2,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
  },
  imageIcon: {
    height: controlIconSize / 2,
    width: controlIconSize / 2,
  },

  // audioChat
  profileContainer: {
    width: '100%',
    height: '40%',
    alignItems: 'center',
    paddingTop: 40,
  },
  receiverAvatarContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureContainer: {
    height: avatarSingleSize,
    width: avatarSingleSize,
    borderRadius: Math.floor(avatarSingleSize / 2),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 2,
  },
  profilePictureContainerLeft: {
    marginRight: -20,
    zIndex: 0,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
  },
  profilePictureContainerCenter: {
    marginTop: 40,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
  },
  profilePictureContainerRight: {
    marginLeft: -20,
    height: avatarMultiSize,
    width: avatarMultiSize,
    borderRadius: Math.floor(avatarMultiSize / 2),
    zIndex: 0,
  },
  profilePicture: {
    height: '100%',
    width: '100%',
  },
  userName: {
    marginTop: 25,
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  timer: {
    marginTop: 10,
    color: '#fff',
    fontSize: 13,
  },
  imageBackground: {
    flex: 1,
    width: null,
    height: null,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba( 0, 0, 0, 0.3 )',
  },
  blurredProfilePicture: {
    height: '100%',
    width: '100%',
  },
});

export default styles;
