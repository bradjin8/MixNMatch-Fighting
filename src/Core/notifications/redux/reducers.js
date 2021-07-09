import IMNotificationActionsConstants from './types';

const initialState = {
  notifications: null,
};

export const notifications = (state = initialState, action) => {
  switch (action.type) {
    case IMNotificationActionsConstants.SET_NOTIFICATIONS:
      return { ...state, notifications: [...action.data] };
    case IMNotificationActionsConstants.DID_SUBSCRIBE:
      return { ...state, didSubscribeToNotifications: true };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
