import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-view';
import AppStyles from '../../../AppStyles';
import { DEVICE_WIDTH } from '../../../helpers/statics';
import BottomTabBar from '../bottom_tab_bar';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../Core/localization/IMLocalization';

const HIT_SLOP = { top: 15, left: 15, right: 15, bottom: 15 };

const CardDetailsView = (props) => {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const [firstName] = useState(props.firstName || '');
  const [lastName] = useState(props.lastName || '');
  const [age] = useState(props.age || '');
  const [school] = useState(props.school || 'UCLA');
  const [distance] = useState(props.distance || '');
  const [bio] = useState(props.bio || '');
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [tappedImageIndex, setTappedImageIndex] = useState(null);
  const [photosUpdated, setPhotosUpdated] = useState(false);
  const [swiperDotWidth, setSwiperDotWidth] = useState(null);
  const [myPhotos] = useState(
    props.instagramPhotos || [props.profilePictureURL],
  );
  const [instagramPhotos, setInstagramPhotos] = useState(
    props.instagramPhotos || [],
  );

  const updatePhotos = (photos) => {
    let myphotos = [];
    let temp = [];

    if (photos.length > 0) {
      photos.map((item, index) => {
        item && temp.push(item);

        if (index % 6 == 5) {
          temp && myphotos.push(temp);
          temp = [];
        }
      });

      myphotos.push(temp);
      setInstagramPhotos(myphotos);
      setPhotosUpdated(true);
    }
  };

  useEffect(() => {
    updatePhotos(instagramPhotos);
    setSwiperDotWidth(Math.floor(DEVICE_WIDTH / myPhotos.length) - 4);
  }, []);

  const onDislikePressed = () => {
    props.setShowMode(0);
    props.onSwipeLeft();
  };

  const onLikePressed = () => {
    props.setShowMode(0);
    props.onSwipeRight();
  };

  const onSuperLikePressed = () => {
    props.setShowMode(0);
    props.onSwipeTop();
  };

  const closeButton = () => (
    <TouchableOpacity
      hitSlop={HIT_SLOP}
      style={styles.closeButton}
      onPress={() => setIsImageViewerVisible(false)}>
      <Text style={styles.closeButton__text}>×</Text>
    </TouchableOpacity>
  );

  const formatViewerImages = () => {
    const myPhotos = [];

    if (photosUpdated) {
      instagramPhotos.map((photos) => {
        photos.map((photo) => {
          myPhotos.push({
            source: {
              uri: photo && photo,
            },
            width: Dimensions.get('window').width,
            height: Math.floor(Dimensions.get('window').height * 0.6),
          });
        });
      });

      return myPhotos;
    } else {
      return [];
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.body} bounces={false}>
        <TouchableOpacity onPress={() => props.setShowMode(0)}>
          <View style={styles.photoView}>
            <Swiper
              style={styles.wrapper}
              removeClippedSubviews={false}
              showsButtons={false}
              loop={false}
              paginationStyle={{ top: 5, bottom: null }}
              dot={
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,.2)',
                    width: swiperDotWidth,
                    height: 4,
                    borderRadius: 4,
                    margin: 2,
                  }}
                />
              }
              activeDot={
                <View
                  style={{
                    backgroundColor: 'white',
                    width: swiperDotWidth,
                    height: 4,
                    borderRadius: 4,
                    margin: 2,
                  }}
                />
              }>
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.nameText}>{firstName + ' ' + lastName}</Text>
                <Text style={styles.infoText}>Portland, OR</Text>
                <Text style={styles.infoText}>Kick boxing, wrestling</Text>
                <View style={{height: 20}}/>
                <Text style={styles.infoText}>Weight 140</Text>
                <Text style={styles.infoText}>Height 5'9</Text>
                <Text style={styles.infoText}>Arm Reach 5'9</Text>
                <Text style={styles.infoText}>Leg Reach 5'9</Text>
                <Text style={styles.infoText}>Injuries Left Knee</Text>
              </View>
            </Swiper>
          </View>
        </TouchableOpacity>
        <View style={{ height: 95 }} />
      </ScrollView>
      <View style={styles.inlineActionsContainer}>
        {props.bottomTabBar && (
          <BottomTabBar
            isDone={props.isDone}
            onDislikePressed={onDislikePressed}
            onSuperLikePressed={onSuperLikePressed}
            onLikePressed={onLikePressed}
            containerStyle={{ width: '80%' }}
          />
        )}
        <ImageView
          isSwipeCloseEnabled={false}
          images={formatViewerImages()}
          isVisible={isImageViewerVisible}
          onClose={() => setIsImageViewerVisible(false)}
          imageIndex={tappedImageIndex}
          controls={{ close: closeButton }}
        />
      </View>
    </View>
  );
};

CardDetailsView.propTypes = {
  firstName: PropTypes.string,
  age: PropTypes.string,
  school: PropTypes.string,
  distance: PropTypes.string,
  profilePictureURL: PropTypes.string,
  instagramPhotos: PropTypes.array,
  bio: PropTypes.string,
  isDone: PropTypes.bool,
  setShowMode: PropTypes.func,
  bottomTabBar: PropTypes.bool,
};

export default CardDetailsView;
