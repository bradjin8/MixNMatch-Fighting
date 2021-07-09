import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { size } from '../../helpers/devices';
import AppStyles from '../../AppStyles';
import FastImage from 'react-native-fast-image';
import Button from 'react-native-button';
import { IMLocalized } from '../../Core/localization/IMLocalization';

const NewMatch = (props) => {
  const { url, onSendMessage, onKeepSwiping } = props;

  return (
    <FastImage source={{ uri: url }} style={styles.container}>
      <Text style={styles.name_style}>{IMLocalized("IT'S A MATCH!")}</Text>
      <Button
        containerStyle={styles.button}
        style={styles.label}
        onPress={onSendMessage}>
        {'SEND A MESSAGE'}
      </Button>
      <TouchableOpacity style={styles.detailBtn} onPress={onKeepSwiping}>
        <Text style={styles.label}>{IMLocalized('KEEP SWIPING')}</Text>
      </TouchableOpacity>
    </FastImage>
  );
};

NewMatch.propTypes = {
  onSendMessage: PropTypes.func,
  onKeepSwiping: PropTypes.func,
  url: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  name_style: {
    fontSize: size(45),
    fontWeight: 'bold',
    color: '#09EE8F',
    marginBottom: size(55),
    backgroundColor: 'transparent',
  },
  button: {
    width: '85%',
    backgroundColor: AppStyles.colorSet.mainThemeForegroundColor,
    borderRadius: 12,
    padding: 15,
    marginBottom: size(15),
  },
  label: {
    fontSize: size(18),
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'transparent',
  },
  detailBtn: {
    marginBottom: size(75),
  },
});

export default NewMatch;
