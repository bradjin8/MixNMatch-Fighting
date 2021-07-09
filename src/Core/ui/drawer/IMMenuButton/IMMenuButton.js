import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import dynamicStyles from './styles';

const IMMenuButton = (props) => {
  const { appStyles } = props;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.btnClickContain}
      underlayColor={styles.btnClickContain.backgroundColor}>
      <View style={styles.btnContainer}>
        <Image source={props.source} style={styles.btnIcon} />
        <Text style={styles.btnText}>{props.title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default IMMenuButton;
