import IMNotificationActionsConstants from './types';

export const setNotifications = (data) => ({
  type: IMNotificationActionsConstants.SET_NOTIFICATIONS,
  data,
});

export const setNotificationListenerDidSubscribe = () => ({
  type: IMNotificationActionsConstants.DID_SUBSCRIBE,
});
