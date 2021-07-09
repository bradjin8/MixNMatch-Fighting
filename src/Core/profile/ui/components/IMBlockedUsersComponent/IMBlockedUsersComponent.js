import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';
import { TNActivityIndicator } from '../../../../truly-native';

const IMBlockedUsersComponent = (props) => {
  const {
    appStyles,
    appConfig,
     blockedUsers,
    onUserUnblock,
    isLoading,
  } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const defaultProfilePhotoURL =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

  const renderItemView = ({ item }) => {
    const profilePicture = item.profilePictureURL ? item.profilePictureURL : defaultProfilePhotoURL;
    return (
      <View style={styles.listItem}>
        <Image
          source={{ uri: profilePicture }}
          style={styles.profilePicture}
        />
        <View style={styles.centerItem}>
          <Text style={styles.text}>
            {item.firstName} {item.lastName}
          </Text>
          {/* <Text>User id: {item.userID || item.id}</Text> */}
          <Text style={styles.text}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.buttonOpacity}
          onPress={() => onUserUnblock(item.userID || item.id)}>
          <Text style={styles.button}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ blockedUsers}
        renderItem={renderItemView}
        keyExtractor={(item, index) => item.email}
        showsVerticalScrollIndicator={false}
      />
      {(isLoading || ! blockedUsers) && (
        <TNActivityIndicator appStyles={appStyles} />
      )}
    </View>
  );
};

export default IMBlockedUsersComponent;
