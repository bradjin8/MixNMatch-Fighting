import { setUsers, setUsersListenerDidSubscribe } from './redux';
import { setBannedUserIDs } from '../user-reporting/redux';
import { userAPIManager } from './../api';
import { reportingManager } from '../user-reporting';

export default class UsersTracker {
  constructor(reduxStore, viewerID) {
    this.reduxStore = reduxStore;
    this.viewerID = viewerID;
  }

  subscribeIfNeeded = () => {
    const state = this.reduxStore.getState();
    if (!state.users.didSubscribeToUsers) {
      this.reduxStore.dispatch(setUsersListenerDidSubscribe());

      this.usersUnsubscribe = userAPIManager.subscribeUsers(
        this.onUsersCollection,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        this.viewerID,
        this.onAbusesUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.usersUnsubscribe) {
      this.usersUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  updateUsersIfNeeded = () => {
    const bannedUserIDs = this.bannedUserIDs;
    const users = this.users;

    if (bannedUserIDs && users) {
      const filteredUsers = users.filter(
        (user) => !bannedUserIDs.includes(user.id),
      );
      this.unsubscribe();
      this.reduxStore.dispatch(setUsers(filteredUsers));
    }
  };

  onUsersCollection = (users) => {
    const nonMeUsers = users.filter((user) => user.id !== this.viewerID);
    if (nonMeUsers?.length > 0) {
      this.users = nonMeUsers;
    }
    this.updateUsersIfNeeded();
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.updateUsersIfNeeded();
  };
}
