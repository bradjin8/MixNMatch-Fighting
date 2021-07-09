import { IMLocalized } from '../../../localization/IMLocalization';
import uuidv4 from 'uuidv4';
import { mockThread } from './localData';

/**
 * Implement These Methods If You Are Adding Your Own Custom Backend
 */

/**
 * user object format:
 *    {
 *      createdAt: '2020-10-01T11:53:44.598Z',
 *      email: 'janedoe@yahoo.com',
 *      firstName: 'Jane',
 *      id: 'vwjr22r2v2r',
 *      lastName: 'Doe',
 *      userId: 'vwjr22r2v2r',
 *    },
 *
 */
const chatFeed = [
  {
    channelID: '131313',
    creatorID: '131313',
    id: '1211212',
    channelName: 'Test Channel',
    title: 'Test Channel',
    participants: [], // contains user data
    participantProfilePictureURLs: [], // array of string
    readUserIDs: [], // contains user objects
    typingUsers: [], // contains user objects
  },
];

/*
 ** Listens to all the channels, and calls the callback every time there are server side changes on the channels (e.g. someone sends a new message to current user)
 ** Parameters
 ** @userID - The user ID whose chat channels we subscribe to
 ** @callback - A callback method that gets called every time changes are identified in the server-side channels
 */
export const subscribeChannels = (userID, callback) => {
  // subscribe to the channels collection, based on userID
  // every time there are changes in channels server side, we call the callback, e.g.
  // callback(listOfChannels)
  // listOfChannels is an array containing the channels with the following format:
  // [{channelID, creatorID, id, channelName, participantProfilePictureURLs, readUserIDs, typingUsers}, ...];
  callback([]);
};

/**
 * Listens to all the chat_feed, and calls the callback every time there are server side changes on the chat feed
 * Parameters
 * @channelID - The channel ID that the chat belongs to
 *
 * @callback - A callback method that gets called every time changes are identified in the server-side chat feed
 **/
export const subscribeSingleChannel = (channelID, callback) => {
  // subscribe to the chat_feed collection, based on userID
  const chatRef = null; // this object will be used to unsubscribe from this listener
  // every time there are changes in channels server side, we call the callback, e.g.
  // callback(chat_feeds)
  // chatfeed is an object with the following format:
  // { title: "Title", participants: [usersData ...], createdAt: 12122112, id: '111dw1wd11d1d', markedAsRead: false };

  return chatRef; // return chatRef object that will be used to unsubscribe from this listener
};

/**
 * Subscribes to message thread snapshot
 * Parameters
 
 * @channel - A callback method that gets called every time changes are identified in the server-side channels

 [{channelID, creatorID, id, channelName, participantProfilePictureURLs, readUserIDs, typingUsers}, ...];
 * @callback - A callback method that gets called every time changes are identified in the server-side chat feed
 */
export const subscribeThreadSnapshot = (channel, callback) => {
  const threadRef = null; //this is used to unsubscribe from the listener

  callback(mockThread);
  return threadRef;
};

/**
 * Sends a message
 * Parameters
 * @sender - The user ID whose chat channels we subscribe to
 * @channel - The channel being hydrated
 * @downloadURL - The download url of the media in the message
 * @inReplyToItem - The message being replied if any
 * @participantProfilePictureURLs - Profile picture urls of the participants
 */
export const sendMessage = (
  sender,
  channel,
  message,
  downloadURL,
  inReplyToItem,
  participantProfilePictureURLs,
) => {
  // update channel thread
  // hydrate chat feed
  return new Promise((resolve) => {
    resolve({ success: true });
  });
};

/**
 * Delete message
 *
 * @message - The message object being deleted
 * 
 * message format
 * 
 * {
    sender,
    channel,
    threadItemID,
    isLastCreatedThreadItem,
    newLastCreatedThreadItem,
   }
 *
 */
export const deleteMessage = ({
  sender,
  channel,
  threadItemID,
  isLastCreatedThreadItem,
  newLastCreatedThreadItem,
}) => {
  // if (isLastCreatedThreadItem && newLastCreatedThreadItem) {
  //   const {
  //     content,
  //     url,
  //     id,
  //     senderID,
  //     readUserIDs,
  //     participantProfilePictureURLs,
  //     createdAt,
  //   } = newLastCreatedThreadItem;
  //  delete message from channel and hyrate chat feed
  //
  // }
};

/**
 * Mark channels typing users
 *
 * @channelID - The id of the channel
 * @typingUsers - The array of users typing
 *
 */
export const markChannelTypingUsers = async (channelID, typingUsers) => {
  // update typingUsers ref
};

/**
 * Mark Channel Thread as read
 *
 * @channelID - The id of the channel
 * @userID - The id of the user perform the action
 * @threadMessageID - The id of the thread to be marked as read
 * @readUserIDs - The ids of the users that have read the thread
 * @participants - participants of the thread
 *
 */
export const markChannelThreadItemAsRead = async (
  channelID,
  userID,
  threadMessageID,
  readUserIDs,
  participants,
) => {
  // mark thread item as read
  // mark last message as read
  // update chat_feed using channelID
};

/**
 * Create a Channel
 *
 * @creator - The user object of the creator of the group
 * @otherParticipants - An array of other participants being added to the group
 * @name - The name of the group being create
 *
 */
export const createChannel = (creator, otherParticipants, name) => {
  // subscribe to the group collection, based on userID
  // every time there are changes in channels server side, we call the callback, e.g.
  // callback(listOfChannels)
  // listOfChannels is an array containing the channels with the following format:
  // [{channelID, creatorID, id, channelName, participantProfilePictureURLs, readUserIDs, typingUsers}, ...];

  return new Promise((resolve) => {
    var channelID = uuidv4(); //random id
    const channelData = {
      creatorID: 212112,
      id: 211212,
      channelID,
      name: name || '',
      participants: [...otherParticipants, creator],
    };
    resolve({ success: true, channel: channelData });
  });
};

/**
 * Leave group
 *
 * @channelId - The channelId of the group the user intends to leave
 * @userId - The userId of the user leaving the group
 * @callback - A callback method that gets called after removing user from group
 *
 */
export const onLeaveGroup = async (channelId, userId, callback) => {
  // subscribe to the group collection, based on userID
  // every time there are changes in channels server side, we call the callback, e.g.
  // callback({ success: true });

  callback({
    success: false,
    error: error,
  });
};

/**
 * Rename group
 *
 * @text - New channel name
 * @channel - The channel to be renamed
 * @callback - A callback method that gets called every time changes are identified in the server-side channels
 *
 */
export const onRenameGroup = (text, channel, callback) => {
  // rename the channel with text
  // callback({ success: true, newChannel });

  callback({
    success: false,
    error: IMLocalized('An error occurred, please try again.'),
  });
};

/**
 *
 * returns timestamp
 */
export const currentTimestamp = () => {
  // return timestamp
};
