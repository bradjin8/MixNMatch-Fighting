import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { size } from '../../helpers/devices';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const NoMoreCard = (props) => {
  return (
    <View style={styles.container}>
      {props.profilePictureURL && (
        <FastImage
          source={{ uri: props.profilePictureURL }}
          style={styles.user_pic_style}
        />
      )}

      {props.profilePictureURL ? (
        <Text style={styles.empty_state_text_style}>
          {IMLocalized("There's no one new around you.")}
        </Text>
      ) : (
        <View style={{ width: '75%', alignItems: 'center' }}>
          <Text style={[styles.empty_state_text_style]}>
            {IMLocalized(
              'Please complete your dating profile to view recommendations.',
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

NoMoreCard.propTypes = {
  isProfileComplete: PropTypes.bool,
  profilePictureURL: PropTypes.string,
  url: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  user_pic_style: {
    width: size(90),
    height: size(90),
    borderRadius: size(45),
    marginBottom: size(15),
  },
  empty_state_text_style: {
    fontSize: size(14),
    color: '#777777',
    textAlign: 'center',
  },
});

export default NoMoreCard;
