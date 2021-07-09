import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-get-random-values';
import Button from 'react-native-button';
import PhoneInput from 'react-native-phone-input';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useColorScheme } from 'react-native-appearance';
import appleAuth, {
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import TNActivityIndicator from '../../truly-native/TNActivityIndicator';
import TNProfilePictureSelector from '../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector';
import CountriesModalPicker from '../../truly-native/CountriesModalPicker/CountriesModalPicker';
import { IMLocalized } from '../../localization/IMLocalization';
import { setUserData } from '../redux/auth';
import { connect } from 'react-redux';
import { localizedErrorMessage } from '../utils/ErrorCode';
import TermsOfUseView from '../components/TermsOfUseView';
import { firebase } from '../../api/firebase/config';
import dynamicStyles from './styles';

const codeInputCellCount = 6;

const SmsAuthenticationScreen = (props) => {
  const appConfig = props.route.params.appConfig;
  const appStyles = props.route.params.appStyles;
  const authManager = props.route.params.authManager;

  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const [inputFields, setInputFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPhoneVisible, setIsPhoneVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(false);
  const [countriesPickerData, setCountriesPickerData] = useState(null);
  const [verificationId, setVerificationId] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState('');

  const myCodeInput = useBlurOnFulfill({
    codeInputValue,
    value: codeInputValue,
    cellCount: codeInputCellCount,
  });
  const [codeInputProps, getCellOnLayoutHandler] = useClearByFocusCell({
    codeInputValue,
    value: codeInputValue,
    setCodeInputValue,
    setValue: setCodeInputValue,
  });

  const phoneRef = useRef(null);
  const recaptchaVerifier = React.useRef(null);
  const firebaseConfig = firebase.app().options;

  const { isSigningUp } = props.route.params;

  useEffect(() => {
    if (codeInputValue?.trim()?.length === codeInputCellCount) {
      onFinishCheckingCode(codeInputValue);
    }
  }, [codeInputValue]);

  useEffect(() => {
    if (phoneRef && phoneRef.current) {
      setCountriesPickerData(phoneRef.current.getPickerData());
    }
  }, [phoneRef]);

  const onFBButtonPress = () => {
    setLoading(true);
    authManager.loginOrSignUpWithFacebook(appConfig).then((response) => {
      if (response?.user) {
        const user = response.user;
        props.setUserData({ user });
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

  const onAppleButtonPress = async () => {
    setLoading(true);
    authManager.loginOrSignUpWithApple(appConfig).then((response) => {
      if (response?.user) {
        const user = response.user;
        props.setUserData({ user });
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

  const signInWithPhoneNumber = (userValidPhoneNumber) => {
    setLoading(true);
    authManager.onVerification(userValidPhoneNumber);
    authManager
      .sendSMSToPhoneNumber(userValidPhoneNumber, recaptchaVerifier.current)
      .then((response) => {
        setLoading(false);
        const confirmationResult = response.confirmationResult;
        if (confirmationResult) {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setVerificationId(confirmationResult.verificationId);
          setIsPhoneVisible(false);
        } else {
          // Error; SMS not sent
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        }
      });
  };

  const trimFields = (fields) => {
    Object.keys(fields).forEach((key) => {
      fields[key] = fields[key].trim();
    });
    return fields;
  };

  const signUpWithPhoneNumber = (smsCode) => {
    const userDetails = {
      ...trimFields(inputFields),
      phone: phoneNumber?.trim(),
      photoFile: profilePictureFile,
    };
    setLoading(true);
    authManager
      .registerWithPhoneNumber(
        userDetails,
        smsCode,
        verificationId,
        appConfig.appIdentifier,
      )
      .then((response) => {
        setLoading(false);
        if (response.error) {
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } else {
          const user = response.user;
          props.setUserData({ user });
          Keyboard.dismiss();
          props.navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user: user } }],
          });
        }
      });
  };

  const onPressSend = async () => {
    const { success, error } = await authManager.validateUsernameFieldIfNeeded(
      inputFields,
      appConfig,
    );

    if (phoneRef.current.isValidNumber() && success) {
      const userValidPhoneNumber = phoneRef.current.getValue();
      setLoading(true);
      setPhoneNumber(userValidPhoneNumber);
      if (!isSigningUp) {
        // If this is a login attempt, we first need to check that the user associated to this phone number exists
        authManager
          .retrieveUserByPhone(userValidPhoneNumber)
          .then((response) => {
            if (response.success) {
              signInWithPhoneNumber(userValidPhoneNumber);
            } else {
              setPhoneNumber(null);
              setLoading(false);
              Alert.alert(
                '',
                IMLocalized(
                  'You cannot log in. There is no account with this phone number.',
                ),
                [{ text: IMLocalized('OK') }],
                {
                  cancelable: false,
                },
              );
            }
          });
      } else {
        signInWithPhoneNumber(userValidPhoneNumber);
      }
    } else {
      Alert.alert(
        '',
        IMLocalized(error ?? 'Please enter a valid phone number.'),
        [{ text: IMLocalized('OK') }],
        {
          cancelable: false,
        },
      );
    }
  };

  const onPressFlag = () => {
    setCountryModalVisible(true);
  };

  const onPressCancelContryModalPicker = () => {
    setCountryModalVisible(false);
  };

  const onFinishCheckingCode = (newCode) => {
    setLoading(true);
    if (isSigningUp) {
      signUpWithPhoneNumber(newCode);
    } else {
      authManager.loginWithSMSCode(newCode, verificationId).then((response) => {
        if (response.error) {
          setLoading(false);
          Alert.alert(
            '',
            localizedErrorMessage(response.error),
            [{ text: IMLocalized('OK') }],
            { cancelable: false },
          );
        } else {
          const user = response.user;
          props.setUserData({ user });
          Keyboard.dismiss();
          props.navigation.navigate('MainStack', { user: user });
        }
      });
    }
  };

  const onChangeInputFields = (text, key) => {
    setInputFields((prevFields) => ({
      ...prevFields,
      [key]: text,
    }));
  };

  const selectCountry = (country) => {
    phoneRef.current.selectCountry(country.iso2);
  };

  const renderPhoneInput = () => {
    return (
      <>
        <PhoneInput
          style={styles.InputContainer}
          flagStyle={styles.flagStyle}
          textStyle={styles.phoneInputTextStyle}
          ref={phoneRef}
          onPressFlag={onPressFlag}
          offset={10}
          allowZeroAfterCountryCode
          textProps={{
            placeholder: IMLocalized('Phone number'),
            placeholderTextColor: '#aaaaaa',
          }}
        />
        {countriesPickerData && (
          <CountriesModalPicker
            data={countriesPickerData}
            appStyles={appStyles}
            onChange={(country) => {
              selectCountry(country);
            }}
            cancelText={IMLocalized('Cancel')}
            visible={countryModalVisible}
            onCancel={onPressCancelContryModalPicker}
          />
        )}
        <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onPressSend()}>
          {IMLocalized('Send code')}
        </Button>
      </>
    );
  };

  const renderCodeInputCell = ({ index, symbol, isFocused }) => {
    let textChild = symbol;

    if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.codeInputCell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const renderCodeInput = () => {
    return (
      <View style={styles.codeFieldContainer}>
        <CodeField
          ref={myCodeInput}
          {...codeInputProps}
          value={codeInputValue}
          onChangeText={setCodeInputValue}
          cellCount={codeInputCellCount}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={renderCodeInputCell}
        />
      </View>
    );
  };

  const renderInputField = (field, index) => {
    return (
      <TextInput
        key={index?.toString()}
        style={styles.InputContainer}
        placeholder={field.placeholder}
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => onChangeInputFields(text, field.key)}
        value={inputFields[field.key]}
        underlineColorAndroid="transparent"
      />
    );
  };

  const renderAsSignUpState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Create new account')}</Text>
        <TNProfilePictureSelector
          setProfilePictureFile={setProfilePictureFile}
          appStyles={appStyles}
        />
        {appConfig.smsSignupFields.map(renderInputField)}
        {isPhoneVisible ? renderPhoneInput() : renderCodeInput()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
          containerStyle={styles.signWithEmailContainer}
          onPress={() =>
            props.navigation.navigate('Signup', {
              appStyles,
              appConfig,
              authManager,
            })
          }>
          {IMLocalized('Sign up with E-mail')}
        </Button>
      </>
    );
  };

  const renderAsLoginState = () => {
    return (
      <>
        <Text style={styles.title}>{IMLocalized('Sign In')}</Text>
        {isPhoneVisible ? renderPhoneInput() : renderCodeInput()}
        <Text style={styles.orTextStyle}> {IMLocalized('OR')}</Text>
        <Button
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
        <Button
          containerStyle={styles.signWithEmailContainer}
          onPress={() =>
            props.navigation.navigate('Login', {
              appStyles,
              appConfig,
              authManager,
            })
          }>
          {IMLocalized('Sign in with E-mail')}
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
        {isSigningUp && renderAsSignUpState()}
        {!isSigningUp && renderAsLoginState()}
        {isSigningUp && (
          <TermsOfUseView
            tosLink={appConfig.tosLink}
            privacyPolicyLink={appConfig.privacyPolicyLink}
            style={styles.tos}
          />
        )}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator appStyles={appStyles} />}
    </View>
  );
};

export default connect(null, {
  setUserData,
})(SmsAuthenticationScreen);
