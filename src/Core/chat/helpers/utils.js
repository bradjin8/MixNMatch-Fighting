import { IMLocalized } from '../../localization/IMLocalization';

const formatMessage = (message) => {
  if (message?.mime?.startsWith('video')) {
    return IMLocalized('Someone sent a video.');
  } else if (message?.mime?.startsWith('audio')) {
    return IMLocalized('Someone sent an audio.');
  } else if (message?.mime?.startsWith('image')) {
    return IMLocalized('Someone sent a photo.');
  } else if (message) {
    return message;
  }
  return '';
};

export { formatMessage };
