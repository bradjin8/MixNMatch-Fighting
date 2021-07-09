import { combineReducers } from 'redux';
import { auth } from '../Core/onboarding/redux/auth';
import { chat } from '../Core/chat/redux';
import { userReports } from '../Core/user-reporting/redux';
import { dating } from './reducers';
import { audioVideoChat } from '../Core/chat/audioVideo';
import { inAppPurchase } from '../Core/inAppPurchase/redux';
import { users } from '../Core/users/redux';

const AppReducer = combineReducers({
  auth,
  userReports,
  chat,
  dating,
  audioVideoChat,
  inAppPurchase,
  users,
});

export default AppReducer;
