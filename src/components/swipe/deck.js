import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Swiper from 'react-native-deck-swiper';
import TinderCard from './tinder_card';
import BottomTabBar from './bottom_tab_bar';
import CardDetailsView from './CardDetailsView/CardDetailsView';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Deck = (props) => {
  const {
    data,
    setShowMode,
    onUndoSwipe,
    onSwipe,
    showMode,
    onAllCardsSwiped,
    // isPlanActive,
    setSubscriptionVisible,
    renderEmptyState,
    renderNewMatch,
    canUserSwipe,
  } = props;

  const isPlanActive = useSelector((state) => state.inAppPurchase.isPlanActive);

  const useSwiper = useRef(null);
  const hasActivePlan = useRef(false);
  const currentDeckIndex = useRef(0);

  useEffect(() => {
    hasActivePlan.current = isPlanActive;
  }, [isPlanActive]);

  const onDislikePressed = () => {
    useSwiper.current.swipeLeft();
  };

  const onSuperLikePressed = () => {
    useSwiper.current.swipeTop();
  };

  const onLikePressed = () => {
    useSwiper.current.swipeRight();
  };

  const handleSwipe = (type, index) => {
    const currentDeckItem = data[index];

    currentDeckIndex.current = index;

    if (canUserSwipe || hasActivePlan.current) {
      onSwipe(type, currentDeckItem);
    } else {
      useSwiper.current.swipeBack();
      alertDailySwipeExceeded();
    }
  };

  const onSwipedLeft = (index) => {
    handleSwipe('dislike', index);
  };

  const onSwipedRight = (index) => {
    handleSwipe('like', index);
  };

  const onSwipedTop = (index) => {
    handleSwipe('like', index);
  };

  const onSwipedAll = () => {
    onAllCardsSwiped();
  };

  const onTapCard = (index) => {
    currentDeckIndex.current = index;
    setShowMode(1);
  };

  const undoSwipe = () => {
    if (!hasActivePlan.current) {
      requestUpgrade();

      return;
    }

    useSwiper.current.swipeBack((index) => {
      const prevDeckItem = data[index - 1];

      currentDeckIndex.current = index;
      onUndoSwipe(prevDeckItem);
    });
  };

  const requestUpgrade = () => {
    Alert.alert(
      IMLocalized('Upgrade account'),
      IMLocalized('Upgrade your account now to undo a swipe.'),
      [
        {
          text: IMLocalized('Upgrade Now'),
          onPress: () => setSubscriptionVisible(true),
        },
        {
          text: IMLocalized('Cancel'),
        },
      ],
      { cancelable: true },
    );
  };

  const alertDailySwipeExceeded = () => {
    Alert.alert(
      IMLocalized('Daily swipes exceeded'),
      IMLocalized(
        'You have exceeded the daily swipes limit. Upgrade your account now to enjoy unlimited swipes',
      ),
      [
        {
          text: IMLocalized('Upgrade Now'),
          onPress: () => setSubscriptionVisible(true),
        },
        {
          text: IMLocalized('Cancel'),
        },
      ],
      { cancelable: true },
    );
  };

  const renderCard = (item) => {
    if (item) {
      return (
        <TinderCard
          key={'TinderCard' + item.id}
          url={item.profilePictureURL}
          name={item.firstName}
          age={item.age}
          school={item.school}
          distance={item.distance}
          setShowMode={setShowMode}
          undoSwipe={undoSwipe}
        />
      );
    }
  };

  const renderCardDetail = (item, isDone) => {
    return (
      item && (
        <CardDetailsView
          key={'CardDetail' + item.id}
          profilePictureURL={item.profilePictureURL}
          firstName={item.firstName}
          lastName={item.lastName}
          age={item.age}
          school={item.school}
          distance={item.distance}
          bio={item.bio}
          instagramPhotos={item?.photos?.length > 0 ? item.photos : [item.profilePictureURL]}
          setShowMode={setShowMode}
          onSwipeTop={onSuperLikePressed}
          onSwipeRight={onLikePressed}
          onSwipeLeft={onDislikePressed}
          isDone={isDone}
          bottomTabBar={true}
        />
      )
    );
  };

  const renderOverlayLabel = (label, color) => {
    return (
      <View style={[styles.overlayLabel, { borderColor: color }]}>
        <Text style={[styles.overlayLabelText, { color }]}>{label}</Text>
      </View>
    );
  };

  const renderBottomTabBar = (containerStyle, buttonContainerStyle) => {
    return (
      <View style={styles.bottomTabBarContainer}>
        <BottomTabBar
          onDislikePressed={onDislikePressed}
          onSuperLikePressed={onSuperLikePressed}
          onLikePressed={onLikePressed}
          containerStyle={containerStyle}
          buttonContainerStyle={buttonContainerStyle}
        />
      </View>
    );
  };

  if (data.length === 0) {
    return <View style={styles.noMoreCards}>{renderEmptyState()}</View>;
  }

  return (
    <View style={styles.container}>
      <Swiper
        ref={useSwiper}
        animateCardOpacity={true}
        containerStyle={styles.swiperContainer}
        cards={data}
        renderCard={renderCard}
        cardIndex={0}
        backgroundColor="white"
        stackSize={2}
        verticalSwipe={true}
        infinite={false}
        showSecondCard={true}
        animateOverlayLabelsOpacity={true}
        onTapCard={onTapCard}
        onSwipedRight={onSwipedRight}
        onSwipedTop={onSwipedTop}
        onSwipedLeft={onSwipedLeft}
        onSwipedAll={onSwipedAll}
        swipeBackCard={true}
        overlayLabels={{
          left: {
            title: 'NOPE',
            element: renderOverlayLabel('NOPE', '#E5566D'),
            style: {
              wrapper: styles.overlayWrapper,
            },
          },
          right: {
            title: 'LIKE',
            element: renderOverlayLabel('LIKE', '#4CCC93'),
            style: {
              wrapper: {
                ...styles.overlayWrapper,
                alignItems: 'flex-start',
                marginLeft: 30,
              },
            },
          },
        }}
      />
      {renderBottomTabBar()}
      {showMode == 1 && data[currentDeckIndex.current] && (
        <Modal animationType={'slide'}>
          <View style={styles.cardDetailContainer}>
            <View style={styles.cardDetailL}>
              {renderCardDetail(data[currentDeckIndex.current])}
            </View>
          </View>
        </Modal>
      )}
      {showMode == 2 && (
        <Modal
          transparent={false}
          visible={showMode == 2 ? true : false}
          animationType={'slide'}>
          <View style={styles.newMatch}>{renderNewMatch()}</View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlayLabel: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  overlayLabelText: {
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
  },
  swiperContainer: {
    marginLeft: -20,
    marginTop: -Math.floor(SCREEN_HEIGHT * 0.06),
    backgroundColor: 'transparent',
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginTop: Math.floor(SCREEN_HEIGHT * 0.04),
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.95,
    // paddingBottom: size(100),
    backgroundColor: 'white',
  },
  bottomTabBarContainer: {
    // marginBottom: -8
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
  },
  noMoreCards: {
    position: 'absolute',
    top: 0,
    bottom: 50,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
  },
  newMatch: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'white',
  },
});

export default Deck;
