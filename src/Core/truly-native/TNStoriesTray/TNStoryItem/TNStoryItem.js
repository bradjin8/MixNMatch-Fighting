import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import FastImage from 'react-native-fast-image';

const Image = FastImage;

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

function StoryItem(props) {
  const {
    item,
    index,
    onPress,
    containerStyle,
    imageStyle,
    imageContainerStyle,
    textStyle,
    activeOpacity,
    title,
    appStyles,
    showOnlineIndicator,
  } = props;

  const refs = useRef();
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const lastName = item.lastName || '';
  return (
    <TouchableOpacity
      key={index}
      ref={refs}
      activeOpacity={activeOpacity}
      onPress={() => onPress(item, index, refs)}
      style={[styles.container, containerStyle]}>
      <View style={[styles.imageContainer, imageContainerStyle]}>
        <Image
          style={[styles.image, imageStyle]}
          source={{ uri: item.profilePictureURL || defaultAvatar }}
        />
        {showOnlineIndicator && <View style={styles.isOnlineIndicator} />}
      </View>
      {title && (
        <Text
          style={[
            styles.text,
            textStyle,
          ]}>{`${item.firstName} ${lastName}`}</Text>
      )}
    </TouchableOpacity>
  );
}

StoryItem.propTypes = {
  onPress: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  item: PropTypes.object,
  index: PropTypes.number,
  activeOpacity: PropTypes.number,
  title: PropTypes.bool,
};

export default StoryItem;
