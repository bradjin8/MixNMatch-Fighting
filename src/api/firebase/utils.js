import { FriendshipConstants } from '../constants';

export const filteredNonFriendshipsFromUsers = (
  keyword,
  users,
  friendships,
) => {
  var filteredUsers = users;
  if (keyword && keyword.length > 0) {
    filteredUsers = users.filter((user) => {
      return (
        user.firstName &&
        user.firstName.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
      );
    });
  }
  filteredUsers = filteredUsers.filter(
    (user) => !friendships.find((friendship) => friendship.user.id == user.id),
  );
  return filteredUsers.map((user) => {
    return {
      user: user,
      type: FriendshipConstants.FriendshipType.none,
    };
  });
};
