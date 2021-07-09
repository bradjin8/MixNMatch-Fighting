/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { mockData } from '../../onboarding/utils/api/local/localData';

/**
 * Determine whether the user is in the database
 *
 * @param {object} user - this is a user object
 * const mockData = {
 *    id,
 *    userID,
 *    stripeCustomerID,
 *    phone,
 *    email,
 *    firstName,
 *    lastName,
 *    profilePictureURL,
 *  };
 * @param {function} resolve this callback get invoked after the auth state of the user has been determined
 */
const handleUserFromAuthStateChanged = (user, resolve) => {
  //if user is in our database in call resolve({ ...userData, id: user.uid, userID: user.uid });
  //if user object is null or the user is not logged in then resolve(null)
  resolve({ user: mockData });
};

/**
 * this function tries to retrieve persisted user from other auth providers e.g Firebase, facebook, apple
 *
 * @param {function} resolve
 */
export const tryAlternatePersistedAuthUserRetriever = (resolve) => {
  // verify user is in on the current device and the user exists on our database
  // if success call resolve({ ...userData, id: user.uid, userID: user.uid });
  // if error call resolve(null)
  resolve({ user: mockData });
};

/**
 * Verify that the user is logged in on that device
 */
export const retrievePersistedAuthUser = () => {
  // return a promise
  return new Promise((resolve) => {
    // retrieve saved user from local storage and verify that the user....
    //   is saved in our database for all auth providers
    // if success call resolve({ ...userData, id: user.uid, userID: user.uid });
    // if error call resolve(null)
    resolve(mockData);
  });
};

/**
 * Send password reset to user
 *
 * @param {String} email email of the user retrieving password
 */
export const sendPasswordResetEmail = (email) => {
  //send password reset email
};

/**
 * Sign in with Credential || for apple and facebook auth providers
 *
 * @param {object} authManager the is the injected authmanager in the app
 * @param {object} credential object containing email and password
 * @param {String} appIdentifier the app identifier
 */
const signInWithCredential = (authManager, credential, appIdentifier) => {
  // return a promise
  return new Promise((resolve, _reject) => {
    // log into the app
    // if user is a new user register
    // then log the user in
    // if success call
    // resolve({
    //      user: { ...userData, id: uid, userID: uid },
    //      accountCreated: true, //accountCreated can be "false", if the user exists already
    // });
    // or
    // resolve({ error: ErrorCode.serverError });
    resolve({ user: mockData });
  });
};

/**
 * Register user
 * 
 * @param {object} [userDetails] user details
 * {
    email,
    firstName,
    lastName,
    password,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  }
 * @param {Strng} appIdentifier app identifier of the app
 */
export const register = (userDetails, appIdentifier) => {
  // return a promise
  return new Promise(function (resolve, _reject) {
    // register the user in the database
    // if successful resolve({ user: data });
    // if error call resolve({ error: ErrorCode.[the correct error code] });
    resolve({ user: mockData });
  });
};

/**
 * Login with email and password
 *
 * @param {String} email the email of current user
 * @param {String} password the password of current user
 */
export const loginWithEmailAndPassword = async (email, password) => {
  // return a promise
  return new Promise(function (resolve, reject) {
    // log into the app
    // if success call
    // resolve({ user: newUserData });
    // or
    // resolve({ error: ErrorCode.[the correct error code] });
    // resolve({user: mockData})
    resolve({ user: mockData });
  });
};

/**
 * Login with Apple
 *
 * @param {String} identityToken app identity token
 * @param {String} nonce secret key string for apple login
 * @param {String} appIdentifier the app identifier
 */
export const loginWithApple = (identityToken, nonce, appIdentifier) => {
  // initialize apple credential
  const appleCredential = null;

  // return a promise
  return new Promise((resolve, _reject) => {
    // sign in with credential
    // resolve(response)
    // reponse format:
    // {
    //     user: { ...userData, id: uid, userID: uid },
    //     accountCreated: true, //accountCreated can be "false", if the user exists already
    // };
    // or
    // { error: ErrorCode.serverError };
    resolve({ user: mockData });
  });
};

/**
 * Login with Facebook
 *
 * @param {String} accessToken app access token
 * @param {String} appIdentifier app identify
 */
export const loginWithFacebook = (accessToken, appIdentifier) => {
  // initialize facebook credential
  const credential = null;

  // return a promise
  return new Promise((resolve, _reject) => {
    // sign in with credential
    // resolve(response)
    // reponse format:
    // {
    //     user: { ...userData, id: uid, userID: uid },
    //     accountCreated: true, //accountCreated can be "false", if the user exists already
    // };
    // or
    // { error: ErrorCode.serverError };
    resolve({ user: mockData });
  });
};

/**
 * Logout of the device
 */
export const logout = () => {
  // sign out of app for all auth providers
};

/**
 * A listener that verifies the user's phone number
 *
 * @param {String} phone phone number being verified
 */
export const onVerificationChanged = (phone) => {
  //optional
  // listen on and verify user's
};

/**
 * Retrieve user from database using phone number
 *
 * @param {String} phone user's phone number being retreived
 */
export const retrieveUserByPhone = (phone) => {
  // return a promise
  return new Promise((resolve) => {
    // check if the user is logged using phone number
    // call resolve({ error: true }); or
    // call resolve({ success: true });

    resolve({ error: true });
  });
};

/**
 * Send SMS to phone number
 *
 * @param {String} phoneNumber the user's phone number
 * @param {object} captchaVerifier this is used for captcha verification
 */
export const sendSMSToPhoneNumber = (phoneNumber, captchaVerifier) => {
  // return a promise
  return new Promise(function (resolve, _reject) {
    // send sms to user
    // call resolve({ confirmationResult });
    // confirmationResult takes the format: {verificationID: string}
    // resolve({ error: ErrorCode.smsNotSent });
  });
};

/**
 * Login with SMS
 *
 * @param {String} smsCode SMS code sent to the user's phone
 * @param {String} verificationID Verification id of from the backend
 */
export const loginWithSMSCode = (smsCode, verificationID) => {
  // initialize phone credential
  const credential = null;

  // return a promise
  return new Promise(function (resolve, _reject) {
    // login with SMS
    // if successful call resolve({user: userData }); or
    // resolve({ error: ErrorCode.[the correct error code] });
    resolve({ user: mockData });
  });
};

/**
 * Register user with Phone number
 * 
 * @param {String} userDetails an object containing user details
 * userDetails:
 * {
    firstName,
    lastName,
    phone,
    profilePictureURL,
    location,
    signUpLocation,
  }
 * @param {String} smsCode sent to the user
 * @param {String} verificationID the verification ID received from the backend
 * @param {String} appIdentifier the appIdentifier
 */
export const registerWithPhoneNumber = (
  userDetails,
  smsCode,
  verificationID,
  appIdentifier,
) => {
  // return a promise
  return new Promise(function (resolve, _reject) {
    // register user using user data
    // if successful resolve({ user: data }); or
    // resolve({ error: ErrorCode.[the correct error code] });
    resolve({ user: mockData });
  });
};

/**
 * Update profile picture
 *
 * @param {String} userID user id of current user
 * @param {String} profilePictureURL profile picture of current user
 */
export const updateProfilePhoto = (userID, profilePictureURL) => {
  // return a promise
  return new Promise((resolve, _reject) => {
    // update profile picture
    // if success call resolve({ success: true });
    // resolve({ error: error });
    resolve({ success: true });
  });
};

/**
 * Fetch push token from device and store
 *
 * @param {String} user the user object of the current user
 */
export const fetchAndStorePushTokenIfPossible = async (user) => {
  // fetch push token and update for user data with new data
  //   example
  //{
  //     pushToken: token,
  //     pushKitToken: '',
  //     badgeCount: 0,
  // }
};

/**
 *
 * @param {String} userID
 * @param {object} newData object containing new user Data
 * e.g
 * { pushKitToken: token }
 */
export const updateUser = async (userID, newData) => {
  // update user details and last login
  //   return new user object;
  /**
   * * const mockData = {
   *    id,
   *    userID,
   *    stripeCustomerID,
   *    phone,
   *    email,
   *    firstName,
   *    lastName,
   *    profilePictureURL,
   *  };
   */
  return { user: mockData };
};

/**
 * Fetch user Data by user ID
 *
 * @param {String} userID user id of current user
 */
export const getUserByID = async (userID) => {
  // retreive user data ID
  // if successful return user object or
  // return null
  /**
   * * const mockData = {
   *    id,
   *    userID,
   *    stripeCustomerID,
   *    phone,
   *    email,
   *    firstName,
   *    lastName,
   *    profilePictureURL,
   *  };
   */
  return mockData;
};
