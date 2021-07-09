export default class MediaChatTracker {
  /**
   *
   * @param {store} reduxStore redux store to dispatch actions
   * @param {String} userID user ID of the current user
   * @param {Number} chatTimeout the timeout for the call
   */
  constructor(reduxStore, userID, chatTimeout) {
    //initialize redux store
  }

  /**
   *
   * @param {boolean} shouldClean whether to clean signal collection
   */
  async subscribe(shouldClean = true) {
    // subscribe to videochat and audiochat
    // subscribe to videochatModal and audiochatModal
  }

  unsubscribe = () => {
    //usnsubscribe from all listeners
  };
}
