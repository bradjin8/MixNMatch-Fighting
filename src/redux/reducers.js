import IMSwipeActionsConstants from './types';

const initialState = {
  matches: null,
  swipes: null,
  incomingSwipes: null,
  didSubscribeToSwipes: false,
};

export const dating = (state = initialState, action) => {
  switch (action.type) {
    case IMSwipeActionsConstants.SET_SWIPES:
      return { ...state, swipes: [...action.data] };
    case IMSwipeActionsConstants.SET_INCOMING_SWIPES:
      return { ...state, incomingSwipes: [...action.data] };
    case IMSwipeActionsConstants.SET_MATCHES:
      return { ...state, matches: [...action.data] };
    case IMSwipeActionsConstants.DID_SUBSCRIBE_TO_SWIPES:
      return { ...state, didSubscribeToSwipes: true };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
