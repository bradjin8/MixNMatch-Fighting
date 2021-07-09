import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { firebase } from '../Core/api/firebase/config';
import AppStyles from '../AppStyles';
import FastImage from 'react-native-fast-image';

const AvatorView = (props) => {
  const [profilePictureURL, setProfilePictureURL] = useState('');
  const usersUnsubscribe = useRef(null);

  const usersRef = firebase.firestore().collection('users');
  const userRef = usersRef.doc(props.user.userID);

  useEffect(() => {
    usersUnsubscribe.current = userRef.onSnapshot((user) => {
      if (user.exists) {
        setProfilePictureURL(user.data().profilePictureURL);
      }
    });

    return () => {
      usersUnsubscribe.current && usersUnsubscribe.current();
    };
  }, []);

  return (
    <View style={[styles.container, props.style]}>
      <FastImage
        style={styles.profileIcon}
        source={{ uri: profilePictureURL }}
      />
      <View
        style={[
          styles.onlineView,
          props.user.isOnline
            ? {
                backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
              }
            : { backgroundColor: 'gray' },
        ]}
      />
    </View>
  );
};

AvatorView.propTypes = {
  user: PropTypes.object,
  style: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {},
  profileIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  onlineView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: 'white',
  },
});

export default AvatorView;
