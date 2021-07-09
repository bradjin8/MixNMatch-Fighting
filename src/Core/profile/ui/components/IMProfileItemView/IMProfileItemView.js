import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

const IMProfileItemView = (props) => {
  const { appStyles } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const rightArrowIcon = require('../../../../../CoreAssets/right-arrow.png');

  return (
    <TouchableOpacity style={styles.container} onPress={props.onPress}>
      <View style={styles.itemContainer}>
        <Image style={[styles.icon, props.iconStyle]} source={props.icon} />
        <Text style={styles.title}>{props.title}</Text>
      </View>
      <Image style={styles.itemNavigationIcon} source={rightArrowIcon} />
    </TouchableOpacity>
  );
};

export default IMProfileItemView;
