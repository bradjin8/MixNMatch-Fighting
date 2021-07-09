import { firebase } from '../../api/firebase/config';

export const notificationsRef = firebase
  .firestore()
  .collection('notifications');

export const subscribeNotifications = (userId, callback) => {
  return notificationsRef
    .where('toUserID', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(100)
    .onSnapshot(
      (notificationSnapshot) => {
        const notifications = [];
        notificationSnapshot.forEach((notificationDoc) => {
          const notification = notificationDoc.data();
          notification.id = notificationDoc.id;
          notifications.push(notification);
        });
        callback(notifications);
      },
      (error) => {
        console.log(error);
        alert(error);
      },
    );
};

export const updateNotification = async (notification) => {
  try {
    await notificationsRef.doc(notification.id).update({ ...notification });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error, success: false };
  }
};
