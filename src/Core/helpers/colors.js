import { Appearance } from 'react-native-appearance';

export const modedColor = (lightModeColor, darkModeColor) => {
  return Appearance.getColorScheme() === 'dark'
    ? darkModeColor
    : lightModeColor;
};
