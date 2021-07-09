import React from 'react';
import { SafeAreaView } from 'react-native';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';
import Tab from './Tab';

export function TabBarBuilder({
  tabIcons,
  appStyles,
  route,
  state,
  navigation,
}) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  return (
    <SafeAreaView style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        return (
          <Tab
            key={index + ''}
            route={state.routes[index]}
            tabIcons={tabIcons}
            appStyles={appStyles}
            focus={state.index === index}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </SafeAreaView>
  );
}

export default TabBarBuilder;
