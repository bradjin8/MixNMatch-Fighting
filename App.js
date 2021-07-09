import React, { useEffect, useState } from 'react';

import { AppRegistry, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import * as RNLocalize from 'react-native-localize';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { setI18nConfig } from './src/Core/localization/IMLocalization';
import { AppNavigator } from './src/navigations/AppNavigation';
import { AppCallWrapper } from './src/Core/chat/audioVideo';
import IAPManagerWrapped from './src/Core/inAppPurchase/IAPManagerWrapped';
import AppReducer from './src/redux';
import { enableScreens } from 'react-native-screens';
import DynamicAppStyles from './src/DynamicAppStyles';
import DatingConfig from './src/DatingConfig';

const MainNavigator = AppCallWrapper(AppNavigator);

const store = createStore(AppReducer, applyMiddleware(thunk));

// const useForceUpdate = () => useState()[1];

const App = (props) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  enableScreens();

  useEffect(() => {
    SplashScreen.hide();
    console.disableYellowBox = true;
    setI18nConfig();
    RNLocalize.addEventListener('change', handleLocalizationChange);
    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  const handleLocalizationChange = () => {
    setI18nConfig();
    // useForceUpdate();
  };

  return (
    <Provider store={store}>
      <AppearanceProvider>
        <IAPManagerWrapped
          appStyles={DynamicAppStyles}
          appConfig={DatingConfig}>
          <StatusBar />
          <MainNavigator screenProps={{ theme: colorScheme }} />
        </IAPManagerWrapped>
      </AppearanceProvider>
    </Provider>
  );
};

App.propTypes = {};

App.defaultProps = {};

AppRegistry.registerComponent('App', () => App);

export default App;
