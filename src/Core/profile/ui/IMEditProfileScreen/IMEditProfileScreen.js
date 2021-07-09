import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import TextButton from 'react-native-button';
import { userAPIManager } from '../../../api';
import IMFormComponent from '../IMFormComponent/IMFormComponent';
import { setUserData } from '../../../onboarding/redux/auth';
import { IMLocalized } from '../../../localization/IMLocalization';
import { Appearance } from 'react-native-appearance';

class IMEditProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.appStyles = props.route.params.appStyles;
    let screenTitle = props.route.params.screenTitle;
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = this.appStyles.navThemeConstants[COLOR_SCHEME];
    props.navigation.setOptions({
      headerTitle: screenTitle,
      headerRight: () => (
        <TextButton style={{ marginRight: 12 }} onPress={this.onFormSubmit}>
          Done
        </TextButton>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });
    this.form = props.route.params.form;
    this.onComplete = props.route.params.onComplete;

    this.state = {
      form: props.form,
      alteredFormDict: {},
    };
    this.didFocusSubscription = props.navigation.addListener(
      'focus',
      (payload) =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentDidMount() {
    this.willBlurSubscription = this.props.navigation.addListener(
      'beforeRemove',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }

  componentWillUnmount() {
    this.didFocusSubscription && this.didFocusSubscription();
    this.willBlurSubscription && this.willBlurSubscription();
  }

  onBackButtonPressAndroid = () => {
    this.props.navigation.goBack();
    return true;
  };

  isInvalid = (value, regex) => {
    const regexResult = regex.test(value);

    if (value.length > 0 && !regexResult) {
      return true;
    }
    if (value.length > 0 && regexResult) {
      return false;
    }
  };

  onFormSubmit = () => {
    var newUser = this.props.user;
    const form = this.form;
    const alteredFormDict = this.state.alteredFormDict;
    var allFieldsAreValid = true;

    form.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const newValue = alteredFormDict[field.key]?.trim();
        if (newValue != null) {
          if (field.regex && this.isInvalid(newValue, field.regex)) {
            allFieldsAreValid = false;
          } else {
            newUser[field.key] = alteredFormDict[field.key]?.trim();
          }
        }
      });
    });

    if (allFieldsAreValid) {
      userAPIManager.updateUserData(this.props.user.id, newUser);
      this.props.setUserData({ user: newUser });
      this.props.navigation.goBack();
      if (this.onComplete) {
        this.onComplete();
      }
    } else {
      alert(
        IMLocalized(
          'An error occurred while trying to update your account. Please make sure all fields are valid.',
        ),
      );
    }
  };

  onFormChange = (alteredFormDict) => {
    this.setState({ alteredFormDict });
  };

  render() {
    return (
      <IMFormComponent
        form={this.form}
        initialValuesDict={this.props.user}
        onFormChange={this.onFormChange}
        navigation={this.props.navigation}
        appStyles={this.appStyles}
      />
    );
  }
}

IMEditProfileScreen.propTypes = {
  user: PropTypes.object,
  setUserData: PropTypes.func,
};

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
  };
};

export default connect(mapStateToProps, { setUserData })(IMEditProfileScreen);
