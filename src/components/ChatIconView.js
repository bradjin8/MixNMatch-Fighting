import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import AppStyles from '../AppStyles';
import AvatorView from './AvatorView';
import FastImage from 'react-native-fast-image';

const ChatIconView = (props) => {
  return (
    <View style={styles.container}>
      {props.participants.length == 0 && (
        <TouchableOpacity
          onPress={props.onPress}
          style={styles.singleParticipation}>
          <Image
            style={styles.singleChatItemIcon}
            source={AppStyles.iconSet.friends}
          />
        </TouchableOpacity>
      )}
      {props.participants.length == 1 && (
        <TouchableOpacity
          onPress={props.onPress}
          style={styles.singleParticipation}>
          <AvatorView user={props.participants[0]} />
          {props.participants[0].online && <View style={styles.onlineMark} />}
        </TouchableOpacity>
      )}
      {props.participants.length > 1 && (
        <TouchableOpacity
          onPress={props.onPress}
          style={styles.multiParticipation}>
          <FastImage
            style={[styles.multiPaticipationIcon, styles.bottomIcon]}
            source={{ uri: props.participants[0].profilePictureURL }}
          />
          <View style={styles.middleIcon} />
          <FastImage
            style={[styles.multiPaticipationIcon, styles.topIcon]}
            source={{ uri: props.participants[1].profilePictureURL }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

ChatIconView.propTypes = {
  participants: PropTypes.array,
  onPress: PropTypes.func,
};

const VIEW_WIDTH = 60;
const MULTI_ICON_WIDTH = 40;
const RADIUS_BORDER_WIDTH = 2;
const TOP_ICON_WIDTH = MULTI_ICON_WIDTH + RADIUS_BORDER_WIDTH * 2;
const ONLINE_MARK_WIDTH = 15 + RADIUS_BORDER_WIDTH * 2;

const styles = StyleSheet.create({
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
    backgroundColor: AppStyles.colorSet.onlineMarkColor,
    height: ONLINE_MARK_WIDTH,
    width: ONLINE_MARK_WIDTH,
    borderRadius: ONLINE_MARK_WIDTH / 2,
    borderWidth: RADIUS_BORDER_WIDTH,
    borderColor: AppStyles.colorSet.mainThemeBackgroundColor,
    right: 0,
    bottom: 0,
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
    borderColor: AppStyles.colorSet.mainThemeBackgroundColor,
  },
  multiPaticipationIcon: {
    position: 'absolute',
    height: MULTI_ICON_WIDTH,
    borderRadius: MULTI_ICON_WIDTH / 2,
    width: MULTI_ICON_WIDTH,
  },
});

export default ChatIconView;
