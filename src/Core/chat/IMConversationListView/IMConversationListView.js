import PropTypes from 'prop-types';
import React, {
  useEffect,
  useLayoutEffect,
  useContext,
  useState,
  useRef,
} from 'react';
import { useSelector, ReactReduxContext } from 'react-redux';
import IMConversationList from '../IMConversationList';
import { ChannelsTracker } from '../api';

const IMConversationListView = (props) => {
  const appStyles =
    (props.navigation &&
      props.route &&
      props.route.params &&
      props.route.params.appStyles) ||
    props.appStyles;
  const currentUser = useSelector((state) => state.auth.user);
  const channels = useSelector((state) => state.chat.channels);
  const { store } = useContext(ReactReduxContext);
  const channelsTracker = useRef(null);

  useEffect(() => {
    const userId = currentUser.id || currentUser.userID;
    if (!userId) {
      return;
    }
    channelsTracker.current = new ChannelsTracker(store, userId);
    channelsTracker.current.subscribeIfNeeded();
  }, [currentUser?.id]);

  useEffect(() => {
    return () => {
      channelsTracker.current?.unsubscribe();
    };
  }, []);

  const onConversationPress = (channel) => {
    props.navigation.navigate('PersonalChat', {
      channel: { ...channel, name: channel.title },
      appStyles: appStyles,
    });
  };

  return (
    <IMConversationList
      loading={channels == null}
      conversations={channels}
      onConversationPress={onConversationPress}
      appStyles={appStyles}
      emptyStateConfig={props.emptyStateConfig}
      user={currentUser}
    />
  );
};

export default IMConversationListView;
