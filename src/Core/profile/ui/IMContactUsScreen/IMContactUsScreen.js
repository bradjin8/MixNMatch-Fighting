import React, { Component } from 'react';
import { BackHandler, Linking } from 'react-native';
import { IMLocalized } from '../../../localization/IMLocalization';
import IMFormComponent from '../IMFormComponent/IMFormComponent';
import { Appearance } from 'react-native-appearance';

class IMContactUsScreen extends Component {
  constructor(props) {
    super(props);
    let appStyles = props.route.params.appStyles;
    let screenTitle =
      props.route.params.screenTitle || IMLocalized('Contact Us');
    let COLOR_SCHEME = Appearance.getColorScheme();
    let currentTheme = appStyles.navThemeConstants[COLOR_SCHEME];
    this.props.navigation.setOptions({
      headerTitle: screenTitle,
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerTintColor: currentTheme.fontColor,
    });

    this.appStyles = props.route.params.appStyles;
    this.form = props.route.params.form;
    this.phone = props.route.params.phone;
    this.initialValuesDict = {};

    this.state = {
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

  onFormButtonPress = (_buttonField) => {
    Linking.openURL(`tel:${this.phone}`);
  };

  render() {
    return (
      <IMFormComponent
        form={this.form}
        initialValuesDict={this.initialValuesDict}
        navigation={this.props.navigation}
        appStyles={this.appStyles}
        onFormButtonPress={this.onFormButtonPress}
      />
    );
  }
}

export default IMContactUsScreen;
