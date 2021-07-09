import React, { useRef } from 'react';
import { Linking } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import styles from './styles';

export default function IMRichTextView(props) {
  const {
    children,
    onHashTagPress,
    defaultTextStyle,
    usernameStyle,
    hashTagStyle,
  } = props;

  const onEmailPress = async (email, matchIndex) => {
    await Linking.openURL(`mailto:${email}`);
  };

  const onPhonePress = async (phoneNumber, matchIndex) => {
    await Linking.openURL(`tel:${phoneNumber}`);
  };

  const onUrlPress = async (url, matchIndex) => {
    const followsProtocol = url.startsWith('http');

    if (followsProtocol) {
      await Linking.openURL(url);
    } else {
      await Linking.openURL(`http://${url}`);
    }
  };

  const onUserPress = (user, matchIndex) => {
    let pattern = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/gim;
    let match = pattern.exec(user);
    const userInfo = {
      firstName: match[1],
      userID: match[2],
      id: match[2],
    };

    props.onUserPress(userInfo);
  };

  const renderText = (matchingString, matches) => {
    let pattern = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/gim;
    let match = pattern.exec(matchingString);

    return `${match[1]}`;
  };

  return (
    <ParsedText
      style={defaultTextStyle}
      parse={[
        { type: 'url', style: styles.url, onPress: onUrlPress },
        {
          type: 'phone',
          style: styles.phone,
          onPress: onPhonePress,
        },
        {
          type: 'email',
          style: styles.email,
          onPress: onEmailPress,
        },
        {
          pattern: /@\[([^\]]+?)\]\(id:([^\]]+?)\)/gim,
          style: [styles.username, usernameStyle],
          onPress: onUserPress,
          renderText,
        },
        {
          pattern: /#(\w+)/,
          style: [styles.hashTag, hashTagStyle],
          onPress: onHashTagPress,
        },
      ]}
      childrenProps={{ allowFontScaling: false }}>
      {children}
    </ParsedText>
  );
}
