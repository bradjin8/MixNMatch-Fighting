import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';

import { SearchBarAlternate } from '../../..';
import { TNStoriesTray } from '../../../truly-native';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMConversationListView } from '../..';
import { IMLocalized } from '../../../localization/IMLocalization';

function IMChatHomeComponent(props) {
  const {
    friends,
    onSearchBarPress,
    onFriendItemPress,
    navigation,
    appStyles,
    onSenderProfilePicturePress,
    onEmptyStatePress,
    searchBarplaceholderTitle,
    emptyStateConfig,
    followEnabled,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const defaultEmptyStateConfig = {
    title: IMLocalized('No Conversations'),
    description: IMLocalized(
      'Add some friends and start chatting with them. Your conversations will show up here.',
    ),
    buttonName: IMLocalized('Add friends'),
    onPress: onEmptyStatePress,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBarAlternate
            onPress={onSearchBarPress}
            placeholderTitle={
              searchBarplaceholderTitle ?? IMLocalized('Search for friends')
            }
            appStyles={appStyles}
          />
        </View>
        {friends && friends.length > 0 && (
          <TNStoriesTray
            onStoryItemPress={onFriendItemPress}
            storyItemContainerStyle={styles.userImageContainer}
            data={friends}
            displayLastName={false}
            appStyles={appStyles}
            showOnlineIndicator={true}
          />
        )}
        <View style={styles.chatsChannelContainer}>
          <IMConversationListView
            navigation={navigation}
            appStyles={appStyles}
            emptyStateConfig={emptyStateConfig ?? defaultEmptyStateConfig}
          />
        </View>
      </ScrollView>
    </View>
  );
}

IMChatHomeComponent.propTypes = {
  onSearchClear: PropTypes.func,
  onFriendItemPress: PropTypes.func,
  onFriendAction: PropTypes.func,
  onSearchBarPress: PropTypes.func,
  channels: PropTypes.array,
};

export default IMChatHomeComponent;
