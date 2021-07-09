import { setChannels } from '../../redux';
import { mockChannelsData } from './localData';

/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */
export default class LocalChannelsTracker {
  /**
   * Constructor: initialize reduxstore and userid here
   *
   * @param {object} reduxStore redux store to dispatch actions
   * @param {string} userID id of the current logged in user
   */
  constructor(reduxStore, userID) {
    this.reduxStore = reduxStore;
    this.userID = userID;
  }

  /**
   * Subscribe to user, channels and abuse listeners on the backend
   */
  subscribeIfNeeded = () => {
    this.reduxStore.dispatch(setChannels(mockChannelsData));
    // subscribe to channelsManager api
    // subscribe to abusesManager api
    // subscribe to userManager api
  };

  /**
   * Unsubscribe from user, channels and abuse listeners on the backend
   *
   */
  unsubscribe = () => {
    // unsubscribe from channelsManager api
    // unsubscribe to abusesManager api
    // unsubscribe to userManager api
  };
}
