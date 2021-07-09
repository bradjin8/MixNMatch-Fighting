import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import IMAudioVideoChat from './IMAudioVideoChat';

const AppCallWrapper = (MainComponent) => {
  const Component = ({ user, audioVideoChatConfig, ...otherProps }) => {
    return (
      <View style={{ flex: 1 }}>
        <MainComponent {...otherProps} />
        {(user.email || user.phone) && (
          <IMAudioVideoChat {...audioVideoChatConfig} />
        )}
      </View>
    );
  };

  const mapStateToProps = ({ auth, audioVideoChat }) => {
    return {
      user: auth.user,
      audioVideoChatConfig: audioVideoChat,
    };
  };

  return connect(mapStateToProps)(Component);
};

export default AppCallWrapper;
