import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, Text } from 'react-native';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

export default function SearchBarAlternate(props) {
  const { onPress, appStyles, placeholderTitle } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const searchIcon = require('../../../CoreAssets/search.png');

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={onPress}>
      <Image style={styles.searchIcon} source={searchIcon} />
      <Text style={styles.searchInput}>{placeholderTitle}</Text>
    </TouchableOpacity>
  );
}

SearchBarAlternate.propTypes = {
  onPress: PropTypes.func,
};
