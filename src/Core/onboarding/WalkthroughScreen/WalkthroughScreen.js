import React, { useLayoutEffect } from 'react';
import {View, Image, Text, ImageBackground} from 'react-native';
import PropTypes from 'prop-types';
import AppIntroSlider from 'react-native-app-intro-slider';
import deviceStorage from '../utils/AuthDeviceStorage';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import { IMLocalized } from '../../localization/IMLocalization';

const WalkthroughScreen = (props) => {
  const { navigation, route } = props;
  const appConfig = route.params.appConfig;
  const appStyles = route.params.appStyles;
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);

  const slides = appConfig.onboardingConfig.walkthroughScreens.map(
    (screenSpec, index) => {
      return {
        key: index,
        text: screenSpec.description,
        title: screenSpec.title,
        image: screenSpec.icon,
      };
    },
  );

  const _onDone = () => {
    deviceStorage.setShouldShowOnboardingFlow('false');
    if (appConfig.isDelayedLoginEnabled) {
      navigation.navigate('DelayedHome');
      return;
    }
    navigation.navigate('LoginStack', { screen: 'Welcome' });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const _renderItem = ({ item, dimensions }) => (
    <View style={[styles.container, dimensions]}>
      <Image source={item.image} resizeMode="cover" style={styles.backgroundImage}>
      {/*<Image
        style={styles.image}
        source={item.image}
        size={100}
        color="white"
      />*/}
      </Image>
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  const _renderNextButton = () => {
    return <Text style={styles.button}>{IMLocalized('Next')}</Text>;
  };

  const _renderSkipButton = () => {
    return <Text style={styles.button}>{IMLocalized('Skip')}</Text>;
  };

  const _renderDoneButton = () => {
    return <Text style={styles.button}>{IMLocalized('Done')}</Text>;
  };

  return (
    <AppIntroSlider
      data={slides}
      slides={slides}
      onDone={_onDone}
      renderItem={_renderItem}
      //Handler for the done On last slide
      showSkipButton={true}
      onSkip={_onDone}
      renderNextButton={_renderNextButton}
      renderSkipButton={_renderSkipButton}
      renderDoneButton={_renderDoneButton}
      dotStyle={styles.dot}
      activeDotStyle={styles.activeDot}
    />
  );
};

WalkthroughScreen.propTypes = {
  navigation: PropTypes.object,
};

export default WalkthroughScreen;
