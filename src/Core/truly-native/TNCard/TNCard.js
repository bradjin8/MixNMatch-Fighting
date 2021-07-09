import React from 'react';
import { TouchableHighlight, View } from 'react-native';
import dynamicStyles from './styles';

const TNCard = ({ containerStyle, radius, onPress, appStyles, children }) => {
  const styles = dynamicStyles(appStyles);

  const containerStyles = [
    styles.tnCardContainer,
    radius && { borderRadius: radius },
    styles.tnCardShadow,
    containerStyle,
  ];

  return (
    <TouchableHighlight style={containerStyles} onPress={onPress}>
      <View>{children}</View>
    </TouchableHighlight>
  );
};

export default TNCard;
