import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FlatList, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import ThreadItem from './ThreadItem';
import TypingIndicator from './TypingIndicator';
import dynamicStyles from './styles';

function MessageThread(props) {
  const {
    thread,
    user,
    onChatMediaPress,
    appStyles,
    onSenderProfilePicturePress,
    onMessageLongPress,
    channelItem,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [isParticipantTyping, setIsParticipantTyping] = useState(false);

  useEffect(() => {
    if (channelItem?.typingUsers) {
      getUsersTyping();
    }
  }, [channelItem]);

  const getUsersTyping = () => {
    const userID = user.id || user.userID;
    const typingUsers = channelItem.typingUsers?.filter(
      (typingUser) => typingUser.isTyping && typingUser.userID !== userID,
    );

    if (typingUsers?.length > 0) {
      setIsParticipantTyping(true);
    } else {
      setIsParticipantTyping(false);
    }
  };

  const renderListHeaderComponent = () => {
    return (
      isParticipantTyping && (
        <View style={[styles.receiveItemContainer]}>
          <View style={styles.indicatorContainer}>
            <View style={styles.typingIndicatorContainer}>
              <TypingIndicator
                containerStyle={styles.indicatorDotContainer}
                dotRadius={5}
              />
            </View>
            <View style={styles.typingIndicatorContentSupport} />
            <View style={styles.typingIndicatorSupport} />
          </View>
        </View>
      )
    );
  };

  const renderChatItem = ({ item, index }) => {
    const isRecentItem = 0 === index;
    return (
      <ThreadItem
        item={item}
        key={'chatitem' + item.createdAt + item.senderID}
        user={{ ...user, userID: user.id }}
        appStyles={appStyles}
        onChatMediaPress={onChatMediaPress}
        onSenderProfilePicturePress={onSenderProfilePicturePress}
        onMessageLongPress={onMessageLongPress}
        isRecentItem={isRecentItem}
      />
    );
  };

  return (
    <FlatList
      inverted={true}
      vertical={true}
      style={styles.messageThreadContainer}
      showsVerticalScrollIndicator={false}
      data={thread}
      renderItem={renderChatItem}
      keyExtractor={(item) => `${item.id}`}
      contentContainerStyle={styles.messageContentThreadContainer}
      removeClippedSubviews={true}
      ListHeaderComponent={() => renderListHeaderComponent()}
      keyboardShouldPersistTaps={'never'}
    />
  );
}

MessageThread.propTypes = {
  thread: PropTypes.array,
  user: PropTypes.object,
  onChatMediaPress: PropTypes.func,
};

export default MessageThread;
