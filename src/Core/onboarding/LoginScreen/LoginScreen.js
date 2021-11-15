import React, {useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import Button from 'react-native-button';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import {connect} from 'react-redux';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import {IMLocalized} from '../../localization/IMLocalization';
import dynamicStyles from './styles';
import {useColorScheme} from 'react-native-appearance';
import {setUserData} from '../redux/auth';
import {localizedErrorMessage} from '../utils/ErrorCode';

const LoginScreen = (props) => {
  const appConfig = props.route.params.appConfig;
  const authManager = props.route.params.authManager;

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const appStyles = props.route.params.appStyles;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const onPressLogin = () => {
    setLoading(true);
    authManager
      .loginWithEmailAndPassword(
        email && email.trim(),
        password && password.trim(),
        appConfig,
      )
      .then((response) => {
        if (response?.user) {
          const user = response.user;
          props.setUserData({
            user: response.user,
          });
          Keyboard.dismiss();
          props.navigation.reset({
            index: 0,
            routes: [{name: 'MainStack', params: {user: user}}],
          });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{text: IMLocalized('OK')}],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  const onFBButtonPress = () => {
    setLoading(true);
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response?.user) {
        const user = response.user;
        props.setUserData({
          user: response.user,
        });
        Keyboard.dismiss();
        props.navigation.reset({
          index: 0,
          routes: [{name: 'MainStack', params: {user: user}}],
        });
      } else {
        setLoading(false);
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{text: IMLocalized('OK')}],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  const onAppleButtonPress = async () => {
    setLoading(true);
    authManager.loginOrSignUpWithApple(appConfig).then((response) => {
      if (response?.user) {
        const user = response.user;
        props.setUserData({user});
        Keyboard.dismiss();
        props.navigation.reset({
          index: 0,
          routes: [{name: 'MainStack', params: {user: user}}],
        });
      } else {
        setLoading(false);
        Alert.alert(
          '',
          localizedErrorMessage(response.error),
          [{text: IMLocalized('OK')}],
          {
            cancelable: false,
          },
        );
      }
    });
  };

  const onForgotPassword = async () => {
    props.navigation.push('ResetPassword', {
      isResetPassword: true,
      appStyles,
      appConfig,
    });
  };

  const onSignUp = async () => {
    props.navigation.push('Signup', {
      appStyles,
      appConfig,
      authManager,
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{flex: 1, width: '100%'}}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity
          style={{alignSelf: 'flex-start'}}
          onPress={() => props.navigation.goBack()}>
          <Image
            style={appStyles.styleSet.backArrowStyle}
            source={appStyles.iconSet.backArrow}
          />
        </TouchableOpacity>
        {Platform.OS !== 'android' && <View style={{height: '20%'}}></View>}
        <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
        <TextInput
          style={styles.InputContainer}
          placeholder={IMLocalized('Email')}
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.InputContainer}
          placeholderTextColor="#aaaaaa"
          secureTextEntry
          placeholder={IMLocalized('Password')}
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <Button
          containerStyle={styles.loginContainer}
          style={styles.loginText}
          onPress={() => onPressLogin()}>
          {IMLocalized('Log In')}
        </Button>
        <View style={styles.forgotPasswordContainer}>
          <Button
            style={styles.forgotPasswordText}
            onPress={() => onForgotPassword()}>
            {IMLocalized('Forgot password?')}
          </Button>
          <Button
            style={styles.forgotPasswordText}
            onPress={() => onSignUp()}>
            {IMLocalized('Sign Up')}
          </Button>
        </View>
        {/*<Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>*/}
        {/*<Button
          containerStyle={styles.facebookContainer}
          style={styles.facebookText}
          onPress={() => onFBButtonPress()}>
          {IMLocalized('Login With Facebook')}
        </Button>
        {appleAuth.isSupported && (
          <AppleButton
            cornerRadius={25}
            style={styles.appleButtonContainer}
            buttonStyle={appStyles.appleButtonStyle[colorScheme]}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => onAppleButtonPress()}
          />
        )}
        {appConfig.isSMSAuthEnabled && (
          <Button
            containerStyle={styles.phoneNumberContainer}
            onPress={() =>
              props.navigation.navigate('Sms', {
                isSigningUp: false,
                appStyles,
                appConfig,
                authManager,
              })
            }>
            {IMLocalized('Login with phone number')}
          </Button>
        )}*/}

        {loading && <TNActivityIndicator appStyles={appStyles}/>}
      </KeyboardAwareScrollView>
    </View>
  )
    ;
};

export default connect(null, {
  setUserData,
})(LoginScreen);
