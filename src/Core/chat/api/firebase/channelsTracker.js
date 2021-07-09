import { setChannelsSubcribed, setChannels } from '../../redux';
import { setUserData } from '../../../onboarding/redux/auth';
import { setBannedUserIDs } from '../../../user-reporting/redux';
import { userAPIManager } from '../../../api';
import { reportingManager } from '../../../user-reporting';
import { subscribeChannels } from './channel';

export default class FirebaseChannelsTracker {
  constructor(reduxStore, userID) {
    this.reduxStore = reduxStore;
    this.userID = userID;
  }

  subscribeIfNeeded = () => {
    const userId = this.userID;
    const state = this.reduxStore.getState();
    if (!state.chat.areChannelsSubcribed) {
      this.reduxStore.dispatch(setChannelsSubcribed());
      this.currentUserUnsubscribe = userAPIManager.subscribeCurrentUser(
        userId,
        this.onCurrentUserUpdate,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        userId,
        this.onAbusesUpdate,
      );
      this.channelsUnsubscribe = subscribeChannels(
        userId,
        this.onChannelCollectionUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.currentUserUnsubscribe) {
      this.currentUserUnsubscribe();
    }
    if (this.channelsUnsubscribe) {
      this.channelsUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  onCurrentUserUpdate = (user) => {
    this.reduxStore.dispatch(setUserData({ user }));
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.updateChannelsIfNeeded();
  };

  onChannelCollectionUpdate = (channels) => {
    this.channels = channels;
    this.updateChannelsIfNeeded();
  };

  channelsWithNoBannedUsers = (channels, bannedUserIDs) => {
    const channelsWithNoBannedUsers = [];
    channels.forEach((channel) => {
      if (
        channel.participants &&
        channel.participants.length > 0 &&
        (!bannedUserIDs ||
          channel.participants.length != 1 ||
          !bannedUserIDs.includes(channel.participants[0].id))
      ) {
        channelsWithNoBannedUsers.push(channel);
      }
    });
    return channelsWithNoBannedUsers;
  };

  updateChannelsIfNeeded = () => {
    if (!this.channels || !this.bannedUserIDs) {
      return;
    }
    const channels = this.channelsWithNoBannedUsers(
      this.channels,
      this.bannedUserIDs,
    );
    this.reduxStore.dispatch(setChannels(channels));
  };
}
