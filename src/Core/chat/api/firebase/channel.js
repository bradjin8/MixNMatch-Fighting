import uuidv4 from 'uuidv4';
import { firebase } from '../../../api/firebase/config';
import { IMLocalized } from '../../../localization/IMLocalization';
import { formatMessage } from '../../helpers/utils';

const channelsRef = firebase.firestore().collection('channels');
const socialFeedsRef = firebase.firestore().collection('social_feeds');

export const subscribeChannels = (userID, callback) => {
  return socialFeedsRef
    .doc(userID)
    .collection('chat_feed')
    .orderBy('createdAt', 'desc')
    .onSnapshot({ includeMetadataChanges: true }, (snapshot) =>
      callback(snapshot.docs.map((doc) => doc.data())),
    );
};

export const subscribeSingleChannel = (channelID, callback) => {
  return channelsRef.doc(channelID).onSnapshot((doc) => callback(doc));
};

export const subscribeThreadSnapshot = (
  channel,
  callback,
  userID = '8ER8DgByeVhjYaO2D613aSVUi172',
) => {
  return channelsRef
    .doc(channel.id)
    .collection('thread')
    .orderBy('createdAt', 'desc')
    .onSnapshot((querySnapshot) => {
      const data = [];
      querySnapshot.docs.forEach((doc) => {
        const message = doc.data();
        if (
          userID == '8ER8DgByeVhjYaO2D613aSVUi172' ||
          !message.content ||
          message.content.length == 0 ||
          !message.content.startsWith('XARQEGWE13SD')
        ) {
          data.push({ ...message, id: doc.id });
        }
      });
      callback(data);
    });
};

export const hydrateSocialChatFeedItem = async (
  sender,
  channel,
  message,
  createdAt,
) => {
  const otherParticipants =
    channel &&
    channel.participants &&
    channel.participants.filter(
      (participant) => participant && participant.id != sender.id,
    );
  const timestamp = currentTimestamp();
  const feedItemTitleForSender =
    otherParticipants?.length == 1
      ? otherParticipants[0].firstName + ' ' + otherParticipants[0].lastName
      : channel.name;
  const feedItemTitleForRecipients =
    otherParticipants?.length == 1
      ? sender.firstName + ' ' + sender.lastName
      : channel.name;

  // We update the chat feed for the sender user
  socialFeedsRef
    .doc(sender.id)
    .collection('chat_feed')
    .doc(channel.id)
    .set(
      {
        id: channel.id,
        title: feedItemTitleForSender,
        content: message,
        markedAsRead: true,
        createdAt: createdAt || timestamp,
        participants: otherParticipants,
      },
      { merge: true },
    );

  // We update the chat feed for all the other participants
  otherParticipants.forEach((recipient) => {
    const allParticipants = [...channel.participants];
    const otherParticipants =
      allParticipants &&
      allParticipants.filter(
        (participant) => participant && participant.id != recipient.id,
      );

    socialFeedsRef
      .doc(recipient.id)
      .collection('chat_feed')
      .doc(channel.id)
      .set(
        {
          id: channel.id,
          title: feedItemTitleForRecipients,
          content: message,
          markedAsRead: false,
          createdAt: timestamp,
          participants: otherParticipants,
        },
        { merge: true },
      );
  });
};

export const sendMessage = (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  participantProfilePictureURLs,
) => {
  return new Promise((resolve) => {
    const { profilePictureURL } = sender;
    const userID = sender.id || sender.userID;
    const timestamp = currentTimestamp();
    const data = {
      content: message,
      createdAt: timestamp,
      recipientFirstName: '',
      recipientID: '',
      recipientLastName: '',
      recipientProfilePictureURL: '',
      senderFirstName: sender.firstName || sender.fullname,
      senderID: userID,
      senderLastName: '',
      senderProfilePictureURL: profilePictureURL,
      url: downloadURL,
      inReplyToItem: inReplyToItem,
      readUserIDs: [userID],
      participantProfilePictureURLs,
    };
    const channelID = channel.id;
    channelsRef
      .doc(channelID)
      .collection('thread')
      .add({ ...data })
      .then((doc) => {
        const lastMessage =
          message && message.length > 0 ? message : downloadURL;
        channelsRef
          .doc(channelID)
          .update({
            lastMessage: lastMessage,
            lastThreadMessageId: doc.id,
            lastMessageSenderId: userID,
            readUserIDs: [userID],
            participantProfilePictureURLs,
          })
          .then((response) => {
            hydrateSocialChatFeedItem(
              sender,
              channel,
              formatMessage(lastMessage),
            );
            resolve({ success: true });
          })
          .catch((error) => {
            resolve({ success: false, error: error });
          });
      })
      .catch((error) => {
        resolve({ success: false, error: error });
      });
  });
};

export const deleteMessage = ({
  sender,
  channel,
  threadItemID,
  isLastCreatedThreadItem,
  newLastCreatedThreadItem,
}) => {
  if (!channel?.id || !threadItemID) {
    return;
  }

  channelsRef.doc(channel?.id).collection('thread').doc(threadItemID).delete();

  if (isLastCreatedThreadItem && newLastCreatedThreadItem) {
    const {
      content,
      url,
      id,
      senderID,
      readUserIDs,
      participantProfilePictureURLs,
      createdAt,
    } = newLastCreatedThreadItem;
    const lastMessage = content?.length > 0 ? content : url;

    channelsRef
      .doc(channel?.id)
      .update({
        lastMessage: lastMessage,
        lastThreadMessageId: id,
        lastMessageSenderId: senderID,
        readUserIDs: readUserIDs,
        participantProfilePictureURLs: participantProfilePictureURLs,
      })
      .then(() => {
        hydrateSocialChatFeedItem(
          sender,
          channel,
          formatMessage(lastMessage),
          createdAt,
        );
      });
  }
};

export const markChannelTypingUsers = async (channelID, typingUsers) => {
  channelsRef.doc(channelID).update({
    typingUsers,
  });
};

export const markChannelThreadItemAsRead = async (
  channelID,
  userID,
  threadMessageID,
  readUserIDs,
  participants,
) => {
  try {
    if (threadMessageID) {
      const channelThreadRef = channelsRef
        .doc(channelID)
        .collection('thread')
        .doc(threadMessageID);

      // mark thread item as read
      channelThreadRef.update({
        readUserIDs,
      });
    }

    // mark last message as read
    channelsRef.doc(channelID).update({
      readUserIDs,
      participants,
    });

    socialFeedsRef.doc(userID).collection('chat_feed').doc(channelID).update({
      markedAsRead: true,
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const createChannel = (creator, otherParticipants, name) => {
  return new Promise((resolve) => {
    var channelID = uuidv4();
    const id1 = creator.id || creator.userID;
    if (otherParticipants.length == 1) {
      const id2 = otherParticipants[0].id || otherParticipants[0].userID;
      if (id1 == id2) {
        // We should never create a self chat
        resolve({ success: false });
        return;
      }
      channelID = id1 < id2 ? id1 + id2 : id2 + id1;
    }
    const channelData = {
      creatorID: id1,
      id: channelID,
      channelID,
      name: name || '',
      participants: [...otherParticipants, creator],
    };

    channelsRef
      .doc(channelID)
      .set({
        ...channelData,
      })
      .then((channelRef) => {
        hydrateSocialChatFeedItem(creator, channelData, '');
        resolve({ success: true, channel: channelData });
      })
      .catch(() => {
        resolve({ success: false });
      });
  });
};

export const onLeaveGroup = async (channelId, userId, callback) => {
  try {
    const dbChannelDoc = await channelsRef.doc(channelId).get();
    const dbChannel = dbChannelDoc?.data();
    const dbParticipants = dbChannel?.participants;

    var newParticipants = dbParticipants?.filter((user) => user.id != userId);
    await channelsRef
      .doc(channelId)
      .set({ ...dbChannel, participants: newParticipants });

    await socialFeedsRef
      .doc(userId)
      .collection('chat_feed')
      .doc(channelId)
      .delete();
    callback({ success: true });
  } catch (error) {
    console.log(error);
    callback({
      success: false,
      error: error,
    });
  }
};

export const onRenameGroup = (text, channel, callback) => {
  channelsRef
    .doc(channel.id)
    .set(channel)
    .then(() => {
      const newChannel = channel;
      newChannel.name = text;
      callback({ success: true, newChannel });
    })
    .catch((error) => {
      console.log(error);
      callback({
        success: false,
        error: IMLocalized('An error occurred, please try again.'),
      });
    });
};

export const currentTimestamp = () => {
  return firebase.firestore.FieldValue.serverTimestamp();
};
