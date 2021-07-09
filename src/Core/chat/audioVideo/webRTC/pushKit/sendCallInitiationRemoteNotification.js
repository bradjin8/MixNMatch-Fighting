import { notificationManager } from '../../../../notifications';
import { callID, pushKitEndpoint, iOSBundleID } from '../../../config';

export const sendCallInitiationRemoteNotification = (
  caller,
  recipients,
  callType,
  channelID,
  channelName,
) => {
  // We send a push kit notification (in case the recipients are on iOS)
  const data = {
    callerID: caller.id,
    recipientIDs: recipients.map((recipient) => recipient.id),
    callType,
    channelID,
    channelName,
    topic: iOSBundleID,
    uuid: callID,
  };
  fetch(pushKitEndpoint, {
    method: 'post',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(data),
  });

  console.log('ttttt push kit ' + JSON.stringify(data));

  // We send a push notification (in case the recipients are on Android)
  recipients.forEach((recipient) => {
    notificationManager.sendCallNotification(
      caller,
      recipient,
      channelID,
      callType,
      callID,
    );
  });
};

export default sendCallInitiationRemoteNotification;
