import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'react-native-appearance';
import Button from 'react-native-button';
import { IMLocalized } from '../../localization/IMLocalization';
import dynamicStyles from './styles';

const ResetPasswordScreen = (props) => {
  const appConfig = props.route.params.appConfig;
  const appStyles = props.route.params.appStyles;
  const authManager = props.route.params.authManager;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [email, setEmail] = useState('');

  const onSendPasswordResetEmail = () => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = re.test(email?.trim());

    if (isValidEmail) {
      authManager.sendPasswordResetEmail(email.trim()).then(() => {
        Alert.alert(
          IMLocalized('Link sent successfully'),
          IMLocalized(
            'Kindly check your email and follow the link to reset your password.',
          ),
          [
            {
              text: IMLocalized('OK'),
              onPress: () => props.navigation.goBack(),
            },
          ],
          { cancelable: false },
        );
      });
    } else {
      Alert.alert(
        IMLocalized('Invalid email'),
        IMLocalized('The email entered is invalid. Please try again'),
        [{ text: IMLocalized('OK') }],
        { cancelable: false },
      );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{IMLocalized('Reset Password')}</Text>
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('E-mail')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onSendPasswordResetEmail()}>
          {IMLocalized('Send Link')}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ResetPasswordScreen;
