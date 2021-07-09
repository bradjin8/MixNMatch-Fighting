import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CardDetailsView from '../../components/swipe/CardDetailsView/CardDetailsView';
import ConversationsHomeComponent from './ConversationsHomeComponent';
import DynamicAppStyles from '../../DynamicAppStyles';
import { TNTouchableIcon } from '../../Core/truly-native';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';
const ConversationsScreen = (props) => {
  const matches = useSelector((state) => state.dating.matches);
  const currentUser = useSelector((state) => state.auth.user);

  const [selectedUser, setSelectedUser] = useState({});
  const [isUserProfileDetailVisible, setIsUserProfileDetailVisible] = useState(
    false,
  );
  const COLOR_SCHEME = useColorScheme();

  useEffect(() => {}, [currentUser, matches]);

  const renderCardDetailModal = () => {
    const {
      profilePictureURL,
      firstName,
      lastName,
      age,
      school,
      distance,
      bio,
      photos,
    } = selectedUser;

    return (
      <CardDetailsView
        profilePictureURL={profilePictureURL}
        firstName={firstName}
        lastName={lastName}
        age={age}
        school={school}
        distance={distance}
        bio={bio}
        instagramPhotos={photos ? photos : []}
        setShowMode={() => setIsUserProfileDetailVisible(false)}
      />
    );
  };

  const onEmptyStatePress = () => {
    props.navigation.navigate('Swipe');
  };

  const onMatchUserItemPress = (otherUser) => {
    const id1 = currentUser.id || currentUser.userID;
    const id2 = otherUser.id || otherUser.userID;
    const channel = {
      id: id1 < id2 ? id1 + id2 : id2 + id1,
      participants: [otherUser],
    };
    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: DynamicAppStyles,
    });
  };

  const emptyStateConfig = {
    title: IMLocalized('No Conversations'),
    description: IMLocalized(
      'Start chatting with the people you matched. Your conversations will show up here.',
    ),
    buttonName: IMLocalized('Start swiping'),
    onPress: onEmptyStatePress,
  };

  return (
    <ConversationsHomeComponent
      matches={matches}
      onMatchUserItemPress={onMatchUserItemPress}
      navigation={props.navigation}
      appStyles={DynamicAppStyles}
      emptyStateConfig={emptyStateConfig}
    />
  );

  {
    /* <View style={styles.container}>
                <Modal visible={isUserProfileDetailVisible} animationType={"slide"}>
                    <View style={styles.cardDetailContainer}>
                        <View style={styles.cardDetailL}>{renderCardDetailModal()}</View>
                    </View>
                </Modal>
            </View> */
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff4',
  },
  cardDetailContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cardDetailL: {
    // position: 'absolute',
    // bottom: 0,
    // width: Statics.DEVICE_WIDTH,
    // height: Statics.DEVICE_HEIGHT * 0.95,
    // paddingBottom: size(100),
    backgroundColor: 'white',
  },
});

export default ConversationsScreen;
