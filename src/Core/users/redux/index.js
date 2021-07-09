const SET_USERS = 'SET_USERS';
const DID_SUBSCRIBE_TO_USERS = 'DID_SUBSCRIBE_TO_USERS';

export const setUsers = (data) => ({
  type: SET_USERS,
  data,
});

export const setUsersListenerDidSubscribe = (data) => ({
  type: DID_SUBSCRIBE_TO_USERS,
  data,
});

const initialState = {
  users: null,
  didSubscribeToUsers: false,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case DID_SUBSCRIBE_TO_USERS:
      return {
        ...state,
        didSubscribeToUsers: true,
      };
    case SET_USERS:
      return { ...state, users: [...action.data] };
    default:
      return state;
  }
};
