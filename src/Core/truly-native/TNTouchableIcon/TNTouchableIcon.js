import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

function TNTouchableIcon(props) {
  const {
    onPress,
    containerStyle,
    iconSource,
    imageStyle,
    title,
    titleStyle,
    renderTitle,
    onLongPress,
    onPressOut,
    onPressIn,
    iconRef,
    onLayout,
    appStyles,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  return (
    <TouchableOpacity
      ref={iconRef}
      onLayout={onLayout}
      style={[styles.headerButtonContainer, containerStyle]}
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      onPressIn={onPressIn}
      onPress={onPress}>
      <Image style={[styles.Image, imageStyle]} source={iconSource} />
      {renderTitle && <Text style={[styles.title, titleStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

TNTouchableIcon.propTypes = {
  onPress: PropTypes.func,
  onPressIn: PropTypes.func,
  onPressOut: PropTypes.func,
  onLongPress: PropTypes.func,
  imageStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  iconSource: Image.propTypes.source,
  title: PropTypes.oneOfType([PropTypes.style, PropTypes.number]),
  renderTitle: PropTypes.bool,
  iconRef: PropTypes.any,
  onLayout: PropTypes.func,
};

export default TNTouchableIcon;
