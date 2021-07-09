import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';

export default function IMMentionListItem(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme, props.appStyles);

  const onSuggestionTap = (user, hidePanel) => {
    props.onSuggestionTap(user);
  };

  const { item: user, index, editorStyles } = props;

  const fullname = `${user.firstName && user.firstName} ${
    user.lastName && user.lastName
  }`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSuggestionTap(user)}
      style={[
        styles.mentionItemContainer,
        // editorStyles.mentionListItemWrapper,
      ]}>
      <View style={styles.mentionPhotoContainer}>
        <View style={styles.mentionPhoto}>
          <FastImage
            source={{ uri: user.profilePictureURL }}
            style={[styles.mentionPhoto]}
          />
        </View>
      </View>
      <View style={styles.mentionNameContainer}>
        <Text style={styles.mentionName}>{fullname}</Text>
      </View>
    </TouchableOpacity>
  );
}
