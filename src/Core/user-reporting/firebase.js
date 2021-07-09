import { firebase } from '../api/firebase/config';

const abuseDBRef = firebase.firestore().collection('reports');
const usersDBRef = firebase.firestore().collection('users');

export const markAbuse = (outBoundID, toUserID, abuseType) => {
  if (outBoundID == toUserID) {
    return Promise((r) => {
      r();
    });
  }
  return new Promise((resolve) => {
    const data = {
      dest: toUserID,
      source: outBoundID,
      type: abuseType,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    abuseDBRef
      .add(data)
      .then(() => {
        resolve({ success: true });
      })
      .catch((error) => {
        resolve({ error: error });
      });
  });
};

export const unsubscribeAbuseDB = (userID, callback) => {
  abuseDBRef.where('source', '==', userID).onSnapshot((querySnapshot) => {
    const abuses = [];
    querySnapshot.forEach((doc) => {
      abuses.push(doc.data());
    });
    return callback(abuses);
  });
};

export const unblockUser = async (currentUserID, blockedUserID, callback) => {
  await abuseDBRef 
    .where('source', '==', currentUserID)
    .where('dest', '==', blockedUserID)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return callback(true);
    });
};

export const hydrateAllReportedUsers = (userID, callback) => {
  return abuseDBRef
    .where('source', '==', userID)
    .onSnapshot((snapshot) => {
      const list = [];
      snapshot.forEach(
        (childSnapshot) => {
          let blockedUser = childSnapshot.data();
          let promise = new Promise((resolve, fail) => {
            usersDBRef
              .doc(blockedUser.dest)
              .get()
              .then(
                (snap) => {
                  let info = snap.data();
                  if (info) {
                    resolve(info);
                  }
                },
                (error) => {
                  fail(error);
                },
              );
          });
          if (promise) {
            list.push(promise);
          }
        },
        (error) => {
          console.error(error);
        },
      );
      callback && callback(Promise.all(list));
    });
};
