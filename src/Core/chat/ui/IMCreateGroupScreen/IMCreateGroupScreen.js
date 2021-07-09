import PropTypes from 'prop-types';
import React, {
  Component,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';
import { BackHandler, View } from 'react-native';
import TextButton from 'react-native-button';
import { useSelector } from 'react-redux';
import { IMCreateGroupComponent } from '../..';
import { channelManager } from '../../api';
import { IMLocalized } from '../../../localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';

const IMCreateGroupScreen = (props) => {
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const currentTheme = appStyles.navThemeConstants[colorScheme];

  const friends = useSelector((state) => state.friends.friends);
  const currentUser = useSelector((state) => state.auth.user);

  const [isNameDialogVisible, setIsNameDialogVisible] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [uiFriends, setUiFriends] = useState(null);
  const didFocusSubscription = useRef(null);
  const willBlurSubscription = useRef(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: IMLocalized('Choose People'),
      headerRight:
        friends.length > 1
          ? () => (
              <TextButton style={{ marginHorizontal: 7 }} onPress={onCreate}>
                {IMLocalized('Create')}
              </TextButton>
            )
          : () => <View />,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
  }, [friends]);

  useEffect(() => {
    setUiFriends(friends);
  }, [friends]);

  useEffect(() => {
    didFocusSubscription.current = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );

    willBlurSubscription.current = props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();
    return true;
  };

  const onCreate = () => {
    const checkedFriends = friends.filter((friend) => friend.checked);
    if (checkedFriends.length === 0) {
      alert('Please choose at least two friends.');
    } else {
      setIsNameDialogVisible(true);
    }
  };

  const onCheck = (friend) => {
    friend.checked = !friend.checked;
    const newFriends = friends.map((item) => {
      if (item.id == friend.id) {
        return friend;
      }
      return item;
    });
    setUiFriends(newFriends);
  };

  const onCancel = () => {
    setGroupName('');
    setIsNameDialogVisible(false);
    setUiFriends(friends);
  };

  const onSubmitName = (name) => {
    const participants = friends.filter((friend) => friend.checked);
    if (participants.length < 2) {
      alert(IMLocalized('Choose at least 2 friends to create a group.'));
      return;
    }
    channelManager
      .createChannel(currentUser, participants, name)
      .then((response) => {
        if (response.success == true) {
          onCancel();
          props.navigation.goBack();
        }
      });
  };

  const onEmptyStatePress = () => {
    props.navigation.goBack();
  };

  return (
    <IMCreateGroupComponent
      onCancel={onCancel}
      isNameDialogVisible={isNameDialogVisible}
      friends={uiFriends}
      onSubmitName={onSubmitName}
      onCheck={onCheck}
      appStyles={appStyles}
      onEmptyStatePress={onEmptyStatePress}
    />
  );
};

export default IMCreateGroupScreen;
