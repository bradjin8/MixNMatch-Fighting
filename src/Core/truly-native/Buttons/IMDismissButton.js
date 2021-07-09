import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const dismissImage = require('../../../CoreAssets/dismiss-rounded.png');

export default class IMDismissButton extends Component {
  render() {
    return (
      <TouchableOpacity style={this.props.style} onPress={this.props.onPress}>
        <Image
          style={{
            resizeMode: 'cover',
            width: 40,
            height: 40,
            tintColor: this.props.tintColor
          }}
          source={dismissImage}
        />
      </TouchableOpacity>
    );
  }
}

IMDismissButton.propTypes = {
  style: PropTypes.object,
  onPress: PropTypes.func,
};
