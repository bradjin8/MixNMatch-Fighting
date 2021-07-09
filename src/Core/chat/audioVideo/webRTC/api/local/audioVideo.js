const onMediaChatDataUpdate = (querySnapshot, chatTimeout, callback) => {};

export const cleanSignalCollection = async (userId) => {};

export const subscribeVideoChat = (userId, chatTimeout, callback) => {};

export const subscribeAudioChat = (userId, chatTimeout, callback) => {};

export const cleanChatRoomParticipants = async (channelId) => {};

export const subscribeCallConnectionData = (data, callback) => {};

export const addCallConnectionData = async (data) => {};

export const addChatRoomParticipants = async (data) => {};

export const updateChatRoomStatus = (channelId, status) => {};

export const subscribeChatRoomParticipants = (data, callback) => {};

export const signalChatRoomParticipants = async (data) => {};

export const exitAudioVideoChatRoom = (data) => {};
