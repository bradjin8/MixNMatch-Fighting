import React, { useEffect, useState } from 'react';
import { Text, View, StatusBar } from 'react-native';

import { firebase } from '../../../../api/firebase/config';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../../../localization/IMLocalization';
import IMProfileItemView from '../IMProfileItemView/IMProfileItemView';
import { TNProfilePictureSelector } from '../../../../truly-native';
import { storageAPI, authAPI } from '../../../../api';
import { loadCachedItem } from '../../../../helpers/cacheManager';

const IMUserProfileComponent = (props) => {
  const { appStyles, menuItems, onUpdateUser, onLogout } = props;
  const {
    profilePictureURL,
    firstName,
    lastName,
    fullname,
    userID,
  } = props.user;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  const [profilePicture, setProfilePicture] = useState(profilePictureURL);

  useEffect(() => {
    const loadImage = async () => {
      const image = await loadCachedItem({ uri: profilePicture });
      setProfilePicture(image);
    };

    loadImage();
  }, [profilePictureURL]);

  const onUserProfileUpdate = (querySnapshot) => {
    const data = querySnapshot.data();
    if (data) {
      onUpdateUser(data);
    }
  };

  useEffect(() => {
    if (props.user.id || props.user.userID) {
      const userRef = firebase
        .firestore()
        .collection('users')
        .doc(props.user.id || props.user.userID);

      const unsubscribeUserFunction = userRef.onSnapshot(onUserProfileUpdate);
      return () => {
        unsubscribeUserFunction();
      };
    }
  }, []);

  const displayName = () => {
    if (
      (firstName && firstName.length > 0) ||
      (lastName && lastName.length > 0)
    ) {
      return firstName + ' ' + lastName;
    }
    return fullname || '';
  };

  const setProfilePictureFile = (photoFile) => {
    if (photoFile == null) {
      // Remove profile photo action
      authAPI.updateProfilePhoto(userID, null).then((finalRes) => {
        if (finalRes.success == true) {
          onUpdateUser({ ...props.user, profilePictureURL: null });
        }
      });
      return;
    }
    // If we have a photo, we upload it to Firebase, and then update the user
    storageAPI.uploadFile(photoFile).then((response) => {
      if (response.error) {
        // there was an error, fail silently
      } else {
        authAPI
          .updateProfilePhoto(userID, response.downloadURL)
          .then((finalRes) => {
            if (finalRes.success == true) {
              onUpdateUser({
                ...props.user,
                profilePictureURL: response.downloadURL,
              });
            }
          });
      }
    });
  };

  const renderMenuItem = (menuItem) => {
    const { title, icon, onPress, tintColor } = menuItem;
    return (
      <IMProfileItemView
        title={title}
        icon={icon}
        iconStyle={{ tintColor: tintColor }}
        onPress={onPress}
        appStyles={appStyles}
      />
    );
  };

  const myProfileScreenContent = () => {
    return (
      <>
        <View style={styles.container}>
          <StatusBar
          // backgroundColor={useDynamicValue('#ffffff', '#121212')}
          // barStyle={useDynamicValue('dark-content', 'light-content')}
          />
          <View style={styles.imageContainer}>
            <TNProfilePictureSelector
              setProfilePictureFile={setProfilePictureFile}
              appStyles={appStyles}
              profilePictureURL={profilePicture}
            />
          </View>
          <Text style={styles.userName}>{displayName()}</Text>
          {menuItems.map((menuItem) => {
            return renderMenuItem(menuItem);
          })}
          <Text onPress={onLogout} style={styles.logout}>
            {IMLocalized('Logout')}
          </Text>
        </View>
      </>
    );
  };

  return <>{myProfileScreenContent()}</>;
};

export default IMUserProfileComponent;
