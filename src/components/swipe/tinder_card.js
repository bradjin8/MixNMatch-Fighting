import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import PropTypes from 'prop-types';
import { size } from '../../helpers/devices';
import * as Statics from '../../helpers/statics';
import AppStyles from '../../AppStyles';
import FastImage from 'react-native-fast-image';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const TinderCard = (props) => {
  const { url, name, age, school, distance } = props;

  return (
    <View style={[styles.container, styles.cardStyle]}>
      <FastImage source={{ uri: url }} style={styles.news_image_style}>
        <ImageBackground
          style={styles.name_info_container}
          source={AppStyles.iconSet.BackgroundLayer}>
          <View style={styles.userDetailContainer}>
            <Text style={styles.name_style}>
              {name ? name : ' '}, {age ? age : ' '}
            </Text>
            <View style={styles.txtBox}>
              <Image
                style={styles.icon}
                source={AppStyles.iconSet.schoolIcon}
              />
              <Text style={styles.label}>{school ? school : ' '}</Text>
            </View>
            {distance && (
              <View style={styles.txtBox}>
                <Image
                  style={styles.icon}
                  source={AppStyles.iconSet.markerIcon}
                />
                <Text style={styles.label}>{distance}</Text>
              </View>
            )}
          </View>
          <View style={styles.undoIconContainer}>
            <TouchableOpacity
              onPress={props.undoSwipe}
              style={styles.roundUndoIconContainer}>
              <Image style={styles.icon} source={AppStyles.iconSet.undo} />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </FastImage>
    </View>
  );
};

TinderCard.propTypes = {
  school: PropTypes.string,
  url: PropTypes.string,
  name: PropTypes.string,
  age: PropTypes.string,
  distance: PropTypes.number,
  setShowMode: PropTypes.func,
};

const undoIconSize = size(20);
const undoIconContainerSize = undoIconSize + 8;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  cardStyle: {
    position: 'absolute',
    top: 0,
    ...ifIphoneX(
      {
        bottom: 0,
      },
      {
        bottom: 65,
      },
    ),
    left: 0,
    right: 0,
    width: Statics.DEVICE_WIDTH,
  },
  news_image_style: {
    width: Statics.DEVICE_WIDTH - size(25),
    height: Statics.DEVICE_HEIGHT * 0.68, // FIX ME ITS BAD
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginHorizontal: size(10),
    ...ifIphoneX(
      {
        marginTop: size(28),
      },
      {
        marginTop: 0,
      },
    ),
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  name_info_container: {
    padding: size(20),
    flexDirection: 'row',
  },
  userDetailContainer: {
    flex: 4,
  },
  undoIconContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 7,
  },
  roundUndoIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: undoIconContainerSize + 7,
    width: undoIconContainerSize + 7,
    borderRadius: Math.floor(undoIconContainerSize + 7 / 2),
    backgroundColor: '#e95c6f',
    zIndex: 2,
  },
  name_style: {
    fontSize: size(24),
    fontWeight: '700',
    color: 'white',
    marginBottom: size(5),
    backgroundColor: 'transparent',
  },
  txtBox: {
    marginTop: size(3),
    flexDirection: 'row',
  },
  icon: {
    width: size(20),
    height: size(20),
    tintColor: 'white',
  },
  label: {
    paddingLeft: size(10),
    fontSize: size(16),
    fontWeight: '400',
    color: 'white',
    backgroundColor: 'transparent',
  },
  detailBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // zIndex: 3000
  },
});

export default TinderCard;
