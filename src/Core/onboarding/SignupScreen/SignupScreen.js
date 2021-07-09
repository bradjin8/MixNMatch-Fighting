import React, { useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from 'react-native-button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';

const SignupScreen = (props) => {
  const appConfig = props.route.params.appConfig;
  const appStyles = props.route.params.appStyles;
  const authManager = props.route.params.authManager;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [inputFields, setInputFields] = useState({});

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (text) => {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(text).toLowerCase()) ? true : false;
  };

  const validatePassword = (text) => {
    let reg = /^(?=.*[A-Z])(?=.*[a-z])/;
    return reg.test(String(text)) ? true : false;
  };

  const trimFields = (fields) => {
    Object.keys(fields).forEach((key) => {
      fields[key] = fields[key].trim();
    });
    return fields;
  };

  const onRegister = async () => {
    const {
      error: usernameError,
    } = await authManager.validateUsernameFieldIfNeeded(inputFields, appConfig);
    if (usernameError) {
      Alert.alert(
        '',
        IMLocalized(usernameError),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      setInputFields((prevFields) => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    if (!validateEmail(inputFields?.email?.trim())) {
      Alert.alert(
        '',
        IMLocalized('Please enter a valid email address.'),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      return;
    }

    if (inputFields?.password?.trim() == '') {
      Alert.alert(
        '',
        IMLocalized('Password cannot be empty.'),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      setInputFields((prevFields) => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    if (inputFields?.password?.trim()?.length < 6) {
      Alert.alert(
        '',
        IMLocalized(
          'Password is too short. Please use at least 6 characters for security reasons.',
        ),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
      setInputFields((prevFields) => ({
        ...prevFields,
        password: '',
      }));
      return;
    }

    // if (!validatePassword(password)) {
    //   Alert.alert(
    //     '',
    //     IMLocalized(
    //       'The password must contain at least one uppercase and lowercase letter',
    //     ),
    //     [{ text: IMLocalized('OK') }],
    //     {
    //       cancelable: false,
    //     },
    //   );
    //   setPassword('');
    //   return;
    // };

    setLoading(true);

    const userDetails = {
      ...trimFields(inputFields),
      photoFile: profilePictureFile,
      appIdentifier: appConfig.appIdentifier,
    };
    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase();
    }

    authManager
      .createAccountWithEmailAndPassword(userDetails, appConfig)
      .then((response) => {
        const user = response.user;
        if (user) {
          props.setUserData({
            user: response.user,
          });
          Keyboard.dismiss();
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user: user } }],
          });
        } else {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            {
              cancelable: false,
            },
          );
        }
      });
  };

  const onChangeInputFields = (text, key) => {
    setInputFields((prevFields) => ({
      ...prevFields,
      [key]: text,
    }));
  };

  const renderInputField = (field, index) => {
    return (
      <TextInput
        key={index?.toString()}
        style={styles.InputContainer}
        placeholder={field.placeholder}
        placeholderTextColor="#aaaaaa"
        secureTextEntry={field.secureTextEntry}
        onChangeText={(text) => onChangeInputFields(text, field.key)}
        value={inputFields[field.key]}
        underlineColorAndroid="transparent"
        autoCapitalize={field.autoCapitalize}
      />
    );
  };

  const renderSignupWithEmail = () => {
    return (
      <>
        {appConfig.signupFields.map(renderInputField)}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {IMLocalized('Sign Up')}
        </Button>
      </>
    );
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
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureFile={setProfilePictureFile}
          appStyles={appStyles}
        />
        {renderSignupWithEmail()}
        {appConfig.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{IMLocalized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() =>
                props.navigation.navigate('Sms', {
                  isSigningUp: true,
                  appStyles,
                  appConfig,
                  authManager,
                })
              }>
              {IMLocalized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView
          tosLink={appConfig.tosLink}
          privacyPolicyLink={appConfig.privacyPolicyLink}
          style={styles.tos}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SignupScreen);
