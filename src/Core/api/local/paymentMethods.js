/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

// card = {
//   addressCity,
//   addressCountry,
//   addressLine1,
//   addressLine2,
//   addressState,
//   addressZip,
//   brand,
//   cardId,
//   country,
//   expMonth,
//   expYear,
//   funding,
//   isApplePayCard,
//   last4,
//   name,
//   ownerId,
// };

const nativePaymentMethod = {
  title: Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay',
  key: Platform.OS === 'ios' ? 'apple' : 'google',
  last4: Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay',
  iconSource: require('../../../CoreAssets/visa.png'),
  isNativePaymentMethod: true,
};

export default class PaymentMethodDataManager {
  /**
   * Constructor call
   *
   * @param {object} appConfig app configuration
   */
  constructor(appConfig) {
    //initialize appConfig
    this.appConfig = appConfig;
  }

  /**
   * Update payment details on the database
   * 
   * @param {object} paymentDetails object  containing ownerID and card object
   * card = {
        addressCity,
        addressCountry,
        addressLine1,
        addressLine2,
        ....
      }

   */
  updateUserPaymentMethods = async ({ ownerId, card }) => {
    // update user paymetn details
    // return { success: true };
    // return { error, success: false };
  };

  /**
   *Delete a payment source from the database
   *
   * @param {String} cardId cardID of the currently signed in user
   */
  deleteFromUserPaymentMethods = async (cardId) => {
    // delete payment method from database
    //   return { success: true }
    //   return { error, success: false };
  };

  /**
   *
   * @param {String} ownerId the id of the logged in user
   * @param {function} callback a callback that is called when the user data changes on the payment methods backend
   */
  subscribePaymentMethods = (ownerId, callback) => {
    const ref = null; // object that will  be used to unsubscribed from the listener
    // listener always call callback(paymentMethods) whenever there's a change in the payment methods table
    callback([nativePaymentMethod]);
    return ref; //this object unsubscribes from the event
  };

  /**
   * Save payment source
   *
   * @param {String} userId id of the current user
   * @param {String} source the value of source id
   */
  savePaymentSource = async (userId, source) => {
    // save source id based on users' stripe customer id
    //   return { response, success: true }; if successful
    //   return { error, success: false };
  };
}
