import React from 'react';
import { FlatList, ScrollView, I18nManager } from 'react-native';

import TNStoryItem from './TNStoryItem/TNStoryItem';
import PropTypes from 'prop-types';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

function TNStoriesTray(props) {
  const {
    data,
    onStoryItemPress,
    onUserItemPress,
    user,
    displayUserItem,
    userItemShouldOpenCamera,
    storyItemContainerStyle,
    userStoryTitle,
    displayLastName,
    showOnlineIndicator,
    appStyles,
  } = props;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const renderItem = ({ item, index }) => {
    const isSeen =
      item.items && item.idx + 1 === item.items.length && styles.seenStyle;

    return (
      <TNStoryItem
        onPress={onStoryItemPress}
        item={{ ...item, lastName: displayLastName ? item.lastName : ' ' }}
        index={index}
        title={true}
        appStyles={appStyles}
        showOnlineIndicator={showOnlineIndicator && item.isOnline}
        imageContainerStyle={
          storyItemContainerStyle ? storyItemContainerStyle : isSeen
        }
      />
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        displayUserItem ? (
          <TNStoryItem
            onPress={(item, index, refIndex) =>
              onUserItemPress(userItemShouldOpenCamera, refIndex, index)
            }
            appStyles={appStyles}
            title={true}
            index={0}
            item={{ ...user, firstName: userStoryTitle, lastName: '' }}
          />
        ) : null
      }
      style={styles.storiesContainer}
      data={data}
      inverted={I18nManager.isRTL}
      renderItem={renderItem}
      keyExtractor={(item, index) => index + 'item'}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
}

TNStoriesTray.propTypes = {
  data: PropTypes.array,
  onStoryItemPress: PropTypes.func,
  onUserItemPress: PropTypes.func,
  displayUserItem: PropTypes.bool,
  userItemShouldOpenCamera: PropTypes.bool,
  storyItemContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

TNStoriesTray.defaultProps = {
  displayLastName: true,
};

export default TNStoriesTray;
