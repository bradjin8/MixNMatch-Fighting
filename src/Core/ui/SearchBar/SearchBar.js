import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import SearchBox from 'react-native-search-bar';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';

export default function SearchBar(props) {
  const {
    onChangeText,
    onSearchBarCancel,
    onSearch,
    searchRef,
    appStyles,
    placeholder,
    defaultValue,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const onSearchTextChange = (text) => {
    onChangeText(text);
  };

  const onCancel = () => {
    onSearchTextChange('');
    onSearchBarCancel();
  };

  const onSearchClear = () => {
    onSearchTextChange('');
  };

  return (
    <View style={styles.container}>
      <SearchBox
        ref={searchRef}
        placeholder={placeholder || IMLocalized('Search for friends')}
        onChangeText={onSearchTextChange}
        onSearchButtonPress={onSearch}
        showsCancelButton={true}
        searchBarStyle="minimal"
        cancelButtonText={IMLocalized('Cancel')}
        style={styles.searchInput}
        showsCancelButtonWhileEditing={true}
        onCancelButtonPress={onCancel}
        onSearchClear={onSearchClear}
        tintColor={appStyles.colorSet[colorScheme].mainThemeForegroundColor}
        textColor={appStyles.colorSet[colorScheme].mainTextColor}
      />
    </View>
  );
}

SearchBar.propTypes = {
  onSearchBarCancel: PropTypes.func,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  titleStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
  activeOpacity: PropTypes.number,
  searchRef: PropTypes.object,
};
