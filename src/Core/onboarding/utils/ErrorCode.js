import { IMLocalized } from '../../localization/IMLocalization';

export const ErrorCode = {
  passwordInUse: 'passwordInUse',
  badEmailFormat: 'badEmailFormat',
  emailInUse: 'emailInUse',
  invalidPassword: 'invalidPassword',
  noUser: 'noUser',
  rateLimited: 'rateLimited',
  serverError: 'serverError',
  photoUploadFailed: 'photoUploadFailed',
  fbAuthCancelled: 'fbAuthCancelled',
  fbAuthFailed: 'fbAuthFailed',
  appleAuthFailed: 'appleAuthFailed',
  smsNotSent: 'smsNotSent',
  invalidSMSCode: 'invalidSMSCode',
};

export const localizedErrorMessage = (errorCode) => {
  switch (errorCode) {
    case ErrorCode.passwordInUse:
      return IMLocalized(
        'The password is invalid or the user does not have a password',
      );
    case ErrorCode.badEmailFormat:
      return IMLocalized('The email address is badly formatted');
    case ErrorCode.emailInUse:
      return IMLocalized(
        'The email address is already in use by another account.',
      );
    case ErrorCode.invalidPassword:
      return IMLocalized('The given password is invalid');
    case ErrorCode.noUser:
      return IMLocalized(
        'There is no user record corresponding to this identifier. The user may have been deleted.',
      );
    case ErrorCode.rateLimited:
      return IMLocalized('Too many unsuccessful login attempts');
    case ErrorCode.photoUploadFailed:
      return IMLocalized('Profile photo failed to upload');
    case ErrorCode.smsNotSent:
      return IMLocalized(
        'The SMS was not sent due to an error. Please try again.',
      );
    case ErrorCode.invalidSMSCode:
      return IMLocalized('The verification code is invalid. Please try again.');
    default:
      return IMLocalized(
        'An error came up while logging you in. Please try again. Error code was ' +
          errorCode,
      );
  }
};
