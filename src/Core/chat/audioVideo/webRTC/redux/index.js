const UPDATE_USER = 'UPDATE_USER';
const SET_IS_MEDIA_CHAT_VISIBLE = 'SET_IS_MEDIA_CHAT_VISIBLE';
const SET_MEDIA_CHAT_RECEIVER = 'SET_MEDIA_CHAT_RECEIVER';
const SET_MEDIA_CHAT_DATA = 'SET_MEDIA_CHAT_DATA';

export const setMediaChatReceivers = (data) => ({
  type: SET_MEDIA_CHAT_RECEIVER,
  data,
});

export const setIsMediaChatVisible = (data) => ({
  type: SET_IS_MEDIA_CHAT_VISIBLE,
  data,
});

export const setMediaChatData = (data) => ({
  type: SET_MEDIA_CHAT_DATA,
  data,
});

const initialState = {
  audioVideoChatReceivers: [],
  chatType: '',
  channelId: '',
  channelTitle: '',
  mediaChatData: null,
  isMediaChatVisible: false,
  user: {},
};

export const audioVideoChat = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      };
    case SET_MEDIA_CHAT_RECEIVER:
      return {
        ...state,
        audioVideoChatReceivers: [...action.data.receivers],
        chatType: action.data.type,
        channelId: action.data.channelId,
        channelTitle: action.data.channelTitle,
      };
    case SET_IS_MEDIA_CHAT_VISIBLE:
      return {
        ...state,
        isMediaChatVisible: action.data,
      };
    case SET_MEDIA_CHAT_DATA:
      return {
        ...state,
        mediaChatData: action.data,
      };
    case 'LOG_OUT':
      return initialState;
    default:
      return state;
  }
};
