/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

import { mockData } from './localData';

/**
 * A method that logs the user into his account
 * Parameters
 * @username - The user's username
 * @password - The user's password
 *
 * returns a promise that resolves to user data
 **/
const loginWithEmailAndPassword = (email, password) => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData });
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  });
};

/**
 * A method that creates a new user using email and password
 * Parameters
 * @userDetails - The user details submitted by the user
 * format of userDetials:
 * const userDetails = {
 *     id,
 *     userID,
 *     stripeCustomerID,
 *     phone,
 *     email,
 *     firstName,
 *     lastName,
 *     profilePictureURL,
 *     ...
 *  };
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 *
 * returns a promise that resolves to user data
 **/
const createAccountWithEmailAndPassword = (userDetails, appConfig) => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData });
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  });
};

/**
 * Registers users using Facebook gateway
 *
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 * returns a promise that resolves to user data
 **/
const loginOrSignUpWithFacebook = (appConfig) => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData });
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  });
};

/**
 * A method that creates a new user using facebook gateway
 *
 * @appConfig - config containing details of he app
 *
 * format of config:
 *
 * const config = {
 *    isSMSAuthEnabled: true,
 *    isUIOnlyVariantEnabled: true,
 *    isFirebaseBackendEnabled: false,
 *    appIdentifier: 'rn-messenger-android',
 *    ...
 * }
 *
 * returns a promise that resolves to user data
 **/
const loginOrSignUpWithApple = () => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData });
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  });
};

/**
 * Send out a password reset to the user's email
 * Parameters
 * @email - The user's email
 *
 * returns a promise that resolves to user data
 **/
const sendPasswordResetEmail = (email) => {
  return {};
};

/**
 * Login using the SMS code
 *
 * returns a promise that resolves to user data
 **/
const loginWithSMSCode = () => {
  return new Promise(function (resolve, _reject) {
    resolve({ user: mockData });
    // morkData takes the format of:
    // const mockData = {
    //   id,
    //   userID,
    //   stripeCustomerID,
    //   phone,
    //   email,
    //   firstName,
    //   lastName,
    //   profilePictureURL,
    // };
  });
};

/*
 ** Logout out of the app
 **
 ** returns a promise that resolves to user data
 */
const logout = () => {};

const retrievePersistedAuthUser = () => {
  return new Promise((resolve) => {
    resolve(null);
  });
};

const localAuthManager = {
  loginWithEmailAndPassword,
  createAccountWithEmailAndPassword,
  loginOrSignUpWithFacebook,
  loginOrSignUpWithApple,
  loginWithSMSCode,
  sendPasswordResetEmail,
  logout,
  retrievePersistedAuthUser,
};

export default localAuthManager;
