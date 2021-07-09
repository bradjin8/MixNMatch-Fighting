import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
// import Modal from 'react-native-modalbox';
import Modal from 'react-native-modal-patch';
import { useSelector, useDispatch } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import Swiper from 'react-native-swiper';
import {
  initConnection,
  requestSubscription,
  getSubscriptions,
} from 'react-native-iap';
import { IMLocalized } from '../../localization/IMLocalization';
import { setPlans } from '../redux';
import dynamicStyles from './styles';

export default function IMSubscriptionScreen(props) {
  const {
    visible,
    onClose,
    processing,
    setProcessing,
    onSetSubscriptionPeriod,
    appStyles,
    appConfig,
  } = props;

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const subscriptions = useSelector((state) => state.inAppPurchase.plans);

  const [selectedSubscriptionIndex, setSelectedSubscriptionIndex] = useState(0);
  const [selectedSubscriptionPlan, setSelectedSubscriptionPlan] = useState({});
  const [focusedSlide, setFocusedSlide] = useState(
    appConfig.subscriptionSlideContents[0],
  );

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  useEffect(() => {
    if (subscriptions.length === 0) {
      (async () => {
        await initConnection();
        getIAPProducts();
      })();
    }
  }, [subscriptions]);

  const onSubscriptioinPlanPress = (item, index) => {
    setSelectedSubscriptionIndex(index);
    setSelectedSubscriptionPlan(item);
  };

  const handleSubscription = async () => {
    const period =
      selectedSubscriptionPlan.subscriptionPeriodUnitIOS ||
      selectedSubscriptionPlan.subscriptionPeriodAndroid;

    try {
      setProcessing(true);
      onSetSubscriptionPeriod(period.toLowerCase());
      await requestSubscription(selectedSubscriptionPlan.productId);
    } catch (err) {
      setProcessing(false);
    }
  };

  const getIAPProducts = async () => {
    try {
      const plans = await getSubscriptions(props.appConfig.IAP_SKUS);

      if (plans.length > 0) {
        setSelectedSubscriptionPlan(plans[0]);
      }

      dispatch(setPlans({ plans }));
    } catch (err) {
      console.log(err);
    }
  };

  const onSwipeIndexChange = (index) => {
    setFocusedSlide(appConfig.subscriptionSlideContents[index]);
  };

  const renderInactiveDot = () => <View style={styles.inactiveDot} />;

  const renderActiveDot = () => <View style={styles.activeDot} />;

  const renderSubScriptionPlan = (item, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSubscriptioinPlanPress(item, index)}
        style={styles.subscriptionContainer}>
        <View style={styles.selectContainer}>
          <View
            style={[
              styles.tickIconContainer,
              selectedSubscriptionIndex === index &&
                styles.selectedSubscription,
            ]}>
            {selectedSubscriptionIndex === index && (
              <Image
                style={styles.tick}
                source={require('../assets/tick.png')}
              />
            )}
          </View>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>
            {item?.localizedPrice + '/'}
            <Text style={styles.monthText}>
              {Platform.OS === 'ios'
                ? item?.subscriptionPeriodUnitIOS?.toLowerCase()
                : item.productId === 'annual_vip_subscription'
                ? IMLocalized('year')
                : IMLocalized('month')}
            </Text>
          </Text>
        </View>
        <View style={styles.trialOptionContainer}>
          <View style={styles.trialContainer}>
            <Text style={styles.trialText}>{'Free Trial'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onClose}
      onRequestClose={onClose}
      animationType={'fade'}
      presentationStyle={'pageSheet'}>
      <View style={styles.container}>
        <View style={styles.carouselContainer}>
          <Swiper
            onIndexChanged={onSwipeIndexChange}
            removeClippedSubviews={false}
            containerStyle={{ flex: 1 }}
            dot={renderInactiveDot()}
            activeDot={renderActiveDot()}
            paginationStyle={{
              bottom: 20,
            }}
            loop={false}>
            {appConfig.subscriptionSlideContents.map((image, index) => (
              <View key={index + ''} style={styles.carouselImageContainer}>
                <Image style={styles.carouselImage} source={image.src} />
              </View>
            ))}
          </Swiper>
        </View>
        <View style={styles.subscriptionsContainer}>
          <Text style={styles.headerTitle}>{focusedSlide.title}</Text>
          <Text style={styles.titleDescription}>
            {focusedSlide.description}
          </Text>
          <View style={styles.subscriptionPlansContainer}>
            {subscriptions.map(renderSubScriptionPlan)}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomHeaderTitle}>
            {IMLocalized('Recurring billing, cancel anytime')}
          </Text>
          <Text style={styles.titleDescription}>
            {IMLocalized(
              'We are going to charge you every payment period the amount you displayed above.',
            )}
          </Text>
          <TouchableOpacity
            // disabled={processing || subscriptions.length < 1}
            onPress={handleSubscription}
            style={styles.bottomButtonContainer}>
            <Text style={styles.buttonTitle}>{'Purchase'}</Text>
          </TouchableOpacity>
          {Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelTitle}>{'Cancel'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
