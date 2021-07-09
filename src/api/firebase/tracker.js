import { setUsers } from '../../Core/users/redux';
import {
  setSwipes,
  setMatches,
  setIncomingSwipes,
  setSwipesListenerDidSubscribe,
} from '../../redux/actions';
import { setBannedUserIDs } from '../../Core/user-reporting/redux';
import * as firebaseSwipe from './swipes';
import { userAPIManager } from '../../Core/api';
import { reportingManager } from '../../Core/user-reporting';

export default class SwipeTracker {
  constructor(reduxStore, userID) {
    this.reduxStore = reduxStore;
    this.userID = userID;
    this.recentSwipeAccounts = [];
    this.state = reduxStore.getState();
    this.reduxStore.subscribe(this.syncTrackerToStore);
  }

  syncTrackerToStore = () => {
    this.state = this.reduxStore.getState();
    this.users = this.state.users.users;
  };

  subscribeIfNeeded = () => {
    const userId = this.userID;
    if (!this.state.dating.didSubscribeToSwipes) {
      this.reduxStore.dispatch(setSwipesListenerDidSubscribe());
      this.usersUnsubscribe = userAPIManager.subscribeUsers(
        this.onUsersCollection,
      );
      this.abusesUnsubscribe = reportingManager.unsubscribeAbuseDB(
        userId,
        this.onAbusesUpdate,
      );
      this.inboundSwipesUnsubscribe = firebaseSwipe.subscribeToInboundSwipes(
        userId,
        this.onInboundSwipesUpdate,
      );
      this.outboundSwipesUnsubscribe = firebaseSwipe.subscribeToOutboundSwipes(
        userId,
        this.onOutboundSwipesUpdate,
      );
    }
  };

  unsubscribe = () => {
    if (this.usersUnsubscribe) {
      this.usersUnsubscribe();
    }
    if (this.inboundSwipesUnsubscribe) {
      this.inboundSwipesUnsubscribe();
    }
    if (this.outboundSwipesUnsubscribe) {
      this.outboundSwipesUnsubscribe();
    }
    if (this.abusesUnsubscribe) {
      this.abusesUnsubscribe();
    }
  };

  removeSwipe = (swipeProfileId, userID) => {
    firebaseSwipe.removeSwipe(swipeProfileId, userID);
    this.recentSwipeAccounts = this.recentSwipeAccounts.filter(
      (swipeAccount) => {
        const swipeAcountId = swipeAccount.id || swipeAccount.userID;

        return swipeAcountId !== swipeProfileId;
      },
    );
  };

  addSwipe = (fromUser, toUser, type, callback) => {
    const swipes = this.state.dating.swipes;
    const detectedSwipe = swipes.find((swipe) => swipe.id == toUser.id);

    this.addToRecentSwipesIfNeeded(toUser);

    if (detectedSwipe) {
      // invalid state - current user already swiped on toUser
      return;
    }

    firebaseSwipe.addSwipe(fromUser.id, toUser.id, type, (response) => {
      callback(response);
    });
  };

  addToRecentSwipesIfNeeded = (newSwipeAccount) => {
    const detectedSwipe = this.recentSwipeAccounts.find((swipeAccount) => {
      const swipeAcountId = swipeAccount.id || swipeAccount.userID;
      const newSwipeAccountId = newSwipeAccount.id == newSwipeAccount.userID;

      return swipeAcountId === newSwipeAccountId;
    });

    if (!detectedSwipe) {
      this.recentSwipeAccounts = [...this.recentSwipeAccounts, newSwipeAccount];
    }
  };

  markSwipeAsSeen = (fromUser, toUser) => {
    firebaseSwipe.markSwipeAsSeen(fromUser.id, toUser.id);
  };

  updateUsers = (users) => {
    // We remove all friends and friendships from banned users
    const state = this.reduxStore.getState();
    const bannedUserIDs = state.userReports.bannedUserIDs;

    if (bannedUserIDs) {
      this.users = users.filter((user) => !bannedUserIDs.includes(user.id));
    } else {
      this.users = users;
    }
    this.reduxStore.dispatch(setUsers(this.users));
    this.hydrateSwipes();
  };

  onUsersCollection = (data) => {
    this.updateUsers(data);
  };

  onAbusesUpdate = (abuses) => {
    var bannedUserIDs = [];
    abuses.forEach((abuse) => bannedUserIDs.push(abuse.dest));
    this.reduxStore.dispatch(setBannedUserIDs(bannedUserIDs));
    this.bannedUserIDs = bannedUserIDs;
    this.hydrateSwipes();
  };

  onInboundSwipesUpdate = (inboundSwipes) => {
    this.inboundSwipes = inboundSwipes;
    this.hydrateSwipes();
  };

  onOutboundSwipesUpdate = (outboundSwipes) => {
    this.outboundSwipes = outboundSwipes;
    this.hydrateSwipes();
  };

  hydrateSwipes() {
    const inboundSwipes = this.inboundSwipes;
    const outboundSwipes = this.outboundSwipes;
    const hydratedUsers = this.users;

    if (
      hydratedUsers &&
      hydratedUsers.length > 0 &&
      this.inboundSwipes &&
      this.outboundSwipes &&
      this.bannedUserIDs
    ) {
      // we received all the data we need - users, inbound requests, outbound requests
      const outboundUserIDs = {};

      outboundSwipes.forEach((swipe) => {
        outboundUserIDs[swipe.swipedProfile] = true;
      });
      const inboundUserIDs = {};
      const inboundUserIDsSeenStatus = {};

      inboundSwipes.forEach((swipe) => {
        inboundUserIDs[swipe.author] = true;
        inboundUserIDsSeenStatus[swipe.author] = swipe.hasBeenSeen;
      });
      // We remove all friends and friendships from banned users
      const bannedUserIDs = this.bannedUserIDs;
      const swipes = hydratedUsers
        .filter((user) => outboundUserIDs[user.id] == true)
        .filter((swipe) => !bannedUserIDs.includes(swipe.id));
      const incomingSwipes = hydratedUsers
        .filter((user) => inboundUserIDs[user.id] == true)
        .filter((swipe) => !bannedUserIDs.includes(swipe.id));
      const hydratedMatches = hydratedUsers.filter(
        (user) =>
          outboundUserIDs[user.id] == true && inboundUserIDs[user.id] == true,
      );
      const finalMatches = hydratedMatches
        .filter((match) => !bannedUserIDs.includes(match.id))
        .map((user) => {
          return {
            ...user,
            matchHasBeenSeen: inboundUserIDsSeenStatus[user.id],
          };
        });

      this.reduxStore.dispatch(setMatches(finalMatches));
      this.reduxStore.dispatch(setIncomingSwipes(incomingSwipes));
      this.reduxStore.dispatch(setSwipes(swipes));
    }
  }

  getUserSwipeCount = async (userID) => {
    return firebaseSwipe.getUserSwipeCount(userID);
  };

  updateUserSwipeCount = async (userID, count) => {
    return firebaseSwipe.updateUserSwipeCount(userID, count);
  };
}
