import { firebase } from '../../Core/api/firebase/config';
const db = firebase.firestore();

const usersRef = firebase.firestore().collection('users');

const swipesRef = firebase.firestore().collection('swipes');

const swipeCountRef = firebase.firestore().collection('swipe_counts');

const onCollectionUpdate = (querySnapshot, callback) => {
  const data = [];
  querySnapshot.forEach((doc) => {
    const temp = doc.data();
    temp.id = doc.id;
    data.push(temp);
  });
  return callback(data, usersRef);
};

export const subscribeToInboundSwipes = (userId, callback) => {
  return swipesRef
    .where('swipedProfile', '==', userId)
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const subscribeToOutboundSwipes = (userId, callback) => {
  return swipesRef
    .where('author', '==', userId)
    .onSnapshot((querySnapshot) => onCollectionUpdate(querySnapshot, callback));
};

export const addSwipe = (fromUserID, toUserID, type, callback) => {
  swipesRef
    .add({
      author: fromUserID,
      swipedProfile: toUserID,
      type: type,
      hasBeenSeen: false,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      callback({ success: true });
    })
    .catch((error) => {
      callback({ error: error });
    });
};

export const removeSwipe = (swipeProfileId, userID) => {
  const batch = db.batch();

  const query = swipesRef
    .where('swipedProfile', '==', swipeProfileId)
    .where('author', '==', userID);

  query.get().then(async (querySnapshot) => {
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    batch.commit();
  });
};

export const markSwipeAsSeen = (fromUserID, toUserID) => {
  swipesRef
    .where('author', '==', fromUserID)
    .where('swipedProfile', '==', toUserID)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          hasBeenSeen: true,
        });
      });
    });
};

export const getUserSwipeCount = async (userID) => {
  try {
    const swipeCount = await swipeCountRef.doc(userID).get();

    if (swipeCount.data()) {
      return swipeCount.data();
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const updateUserSwipeCount = (userID, count) => {
  const data = {
    authorID: userID,
    count: count,
  };

  if (count === 1) {
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
  }

  try {
    swipeCountRef.doc(userID).set(data, { merge: true });
  } catch (error) {
    console.log(error);
  }
};
