import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

function Tab({ route, onPress, focus, tabIcons, appStyles }) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(appStyles, colorScheme);
  return (
    <TouchableOpacity style={styles.tabContainer} onPress={onPress}>
      <Image
        source={
          focus ? tabIcons[route.name].focus : tabIcons[route.name].unFocus
        }
        style={[
          styles.tabIcon,
          focus ? styles.focusTintColor : styles.unFocusTintColor,
        ]}
      />
    </TouchableOpacity>
  );
}

export default Tab;
