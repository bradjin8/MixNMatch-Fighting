import React, { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
  validateReceiptIos,
  getAvailablePurchases,
} from 'react-native-iap';
import { updateUserSubscription, getUserSubscription } from './firebase';
import { updateUser } from '../api/firebase/auth';
import IMSubscriptionScreen from './IMSubscriptionScreen/IMSubscriptionScreen';
import { setSubscriptionPlan, setIsPlanActive } from './redux';
import { IAPContext } from './context';

const receiptValidationStatus = {
  SUCCESS: 0,
  COULT_NOT_AUTHENTICATE: 21003,
  EXPIRED_SUBSCRIPTION: 21006,
  COULD_NOT_AUTHORIZE: 21010,
};

const day = 60 * 60 * 24 * 1000;
const week = day * 7;
const month = week * 4;
const year = month * 12;

const IOS_PERIODS_IN_SEC = {
  day,
  week,
  month,
  year,
};

const ANDROID_PERIODS_IN_SEC = {
  d: day,
  w: week,
  m: month,
  y: year,
};

export const IAPManagerWrapped = (props) => {
  const currentUser = useSelector((state) => state.auth.user);
  const planId = useSelector((state) => state.inAppPurchase.planId);
  const isPlanActive = useSelector((state) => state.inAppPurchase.isPlanActive);
  const dispatch = useDispatch();

  const [processing, setProcessing] = useState(false);
  const [subscriptionVisible, setSubscriptionVisible] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const user = useRef(null);
  const planPeriod = useRef('');
  const lastValidatedEmail = useRef('');
  const lastValidatedPhone = useRef('');

  let purchaseUpdateSubscription = null;
  let purchaseErrorSubscription = null;

  useEffect(() => {
    if (subscription) {
      handleUserSubscription(subscription);
      setPlanFromDevice();
    }
  }, [subscription]);

  useEffect(() => {
    const hasNotValidatedUser =
      lastValidatedEmail.current !== currentUser.email ||
      lastValidatedPhone.current !== currentUser.phone;
    const isUserNotEmpty = Object.keys(currentUser).length !== 0;

    if (hasNotValidatedUser && isUserNotEmpty) {
      lastValidatedEmail.current = currentUser.email;
      lastValidatedPhone.current = currentUser.phone;
      user.current = currentUser;
      loadSubscription();
    }
  }, [currentUser?.id]);

  const loadSubscription = async () => {
    const userID = currentUser.id || currentUser.userID;

    const { subscription } = await getUserSubscription(userID);

    setSubscription(subscription);
  };

  const getSubscriptionPeriodDifference = (transactionDate) => {
    let now = +new Date();

    return now - transactionDate;
  };

  const getAndroidComparePeriod = (subscriptionPeriod) => {
    const keySubscriptionPeriods = subscriptionPeriod.split('');
    const times = keySubscriptionPeriods[1];
    const period = keySubscriptionPeriods[2];

    if (times && period) {
      return ANDROID_PERIODS_IN_SEC[period] * times;
    }
  };

  const handleUserSubscription = (subscription) => {
    const { transactionDate, subscriptionPeriod, receipt } = subscription;
    let periodToCompare;

    if (subscriptionPeriod && subscriptionPeriod.startsWith('p')) {
      periodToCompare = getAndroidComparePeriod(subscriptionPeriod);
    }

    if (Platform.OS === 'ios') {
      validateIOSPlan(receipt);

      return;
    }

    if (periodToCompare) {
      const periodDifference = getSubscriptionPeriodDifference(transactionDate);
      const hasNotExpired = periodDifference < periodToCompare;

      if (hasNotExpired && transactionDate) {
        dispatch(setIsPlanActive(true));
      }
    }
  };

  useEffect(() => {
    setPlanFromDevice();
  }, []);

  const setPlanFromDevice = () => {
    if (Platform.OS !== 'ios') {
      setAndroidPlanFromDevice();
    }
  };

  const setAndroidPlanFromDevice = async () => {
    const userID = user.current?.id || user.current?.userID;
    const isPlanValid = await getDeviceAndroidPlans();

    if (userID) {
      updateUser(userID, { isVIP: isPlanValid });
      updateUserSubscription(userID, { active: isPlanValid });
    }
  };

  const validateIOSPlan = async (transactionReceipt) => {
    const userID = user.current?.id || user.current?.userID;
    const { status, latest_receipt } = await validateIOSReceipt(
      transactionReceipt,
    );
    const updatedReceipt = { receipt: latest_receipt, active: true };

    if (status === receiptValidationStatus.SUCCESS) {
      dispatch(setIsPlanActive(true));
      if (userID) {
        updateUserSubscription(userID, updatedReceipt);
        updateUser(userID, { isVIP: true });
      }

      return;
    }

    if (userID) {
      updateUser(userID, { isVIP: false });
      updateUserSubscription(userID, { active: false });
    }

    dispatch(setIsPlanActive(false));
  };

  const getDeviceAndroidPlans = async () => {
    const availablePurchases = await getAvailablePurchases();

    for (let i = 0; i < availablePurchases.length; i++) {
      if (
        props.appConfig.IAP_SKUS.ALL.includes(availablePurchases[i].productId)
      ) {
        return true;
      }
    }

    return false;
  };

  const validateIOSReceipt = async (receipt) => {
    const isTestEnvironment = __DEV__;

    const receiptBody = {
      'receipt-data': receipt,
      password: props.appConfig.IAP_SHARED_SECRET,
    };

    try {
      const validatedReceipt = await validateReceiptIos(
        receiptBody,
        isTestEnvironment,
      );

      return validatedReceipt;
    } catch (error) {
      console.log(error);

      return {};
    }
  };

  const updateSubscriptionDetail = async (purchase) => {
    const {
      productId,
      transactionReceipt: receipt,
      purchaseToken,
      transactionDate,
      originalTransactionIdentifierIOS,
    } = purchase;

    const userID = user.current?.id || user.current?.userID;
    const subscriptionPlan = {
      receipt,
      productId,
      purchaseToken: purchaseToken || '',
      subscriptionPeriod: planPeriod.current,
      transactionDate,
      originalTransactionIdentifierIOS: originalTransactionIdentifierIOS || '',
      userID,
    };

    if (userID) {
      updateUserSubscription(userID, subscriptionPlan);
      setSubscription(subscriptionPlan);
    }
  };

  const processNewPurchase = async (purchase) => {
    const { transactionReceipt } = purchase;

    if (transactionReceipt !== undefined) {
      updateSubscriptionDetail(purchase);
      onSubscriptionClose();
      setProcessing(false);
    }
  };

  useEffect(() => {
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      const receipt = purchase.transactionReceipt;

      if (receipt) {
        try {
          await finishTransaction(purchase);
          await processNewPurchase(purchase);
        } catch (error) {
          console.log('error', error);
        }
      }
    });
    purchaseErrorSubscription = purchaseErrorListener((error) => {
      alert(error.message);
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    };
  }, []);

  const onSetSubscriptionPeriod = (period) => {
    planPeriod.current = period;
  };

  const onSubscriptionClose = () => {
    setSubscriptionVisible(false);
  };

  return (
    <IAPContext.Provider
      value={{
        processing: processing,
        setProcessing: setProcessing,
        subscriptionVisible: subscriptionVisible,
        setSubscriptionVisible: setSubscriptionVisible,
        activePlan: planId,
      }}>
      {props.children}
      <IMSubscriptionScreen
        processing={processing}
        setProcessing={setProcessing}
        onClose={onSubscriptionClose}
        visible={subscriptionVisible}
        onSetSubscriptionPeriod={onSetSubscriptionPeriod}
        appStyles={props.appStyles}
        appConfig={props.appConfig}
      />
    </IAPContext.Provider>
  );
};

export default IAPManagerWrapped;
