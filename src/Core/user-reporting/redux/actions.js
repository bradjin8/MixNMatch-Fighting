import IMUserReportingActionsConstants from './types';

export const setBannedUserIDs = (data) => ({
  type: IMUserReportingActionsConstants.SET_BANNED_USER_IDS,
  data,
});
