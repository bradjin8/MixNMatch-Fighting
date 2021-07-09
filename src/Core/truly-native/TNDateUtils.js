import moment from 'moment';
import { IMLocalized } from '../localization/IMLocalization';

const monthNames = [
  IMLocalized('Jan'),
  IMLocalized('Feb'),
  IMLocalized('Mar'),
  IMLocalized('Apr'),
  IMLocalized('May'),
  IMLocalized('Jun'),
  IMLocalized('Jul'),
  IMLocalized('Aug'),
  IMLocalized('Sep'),
  IMLocalized('Oct'),
  IMLocalized('Nov'),
  IMLocalized('Dec'),
];

const TNDateFormattedTimestamp = (timestamp) => {
  if (timestamp) {
    let time = moment(timestamp.toDate());
    if (moment().diff(time, 'days') == 0) {
      return time.format('H:mm');
    } else if (moment().diff(time, 'week') == 0) {
      return time.fromNow();
    } else {
      return `${monthNames[timestamp.toDate().getMonth()]} ${time.format(
        'D, Y',
      )}`;
    }
  }
  return '';
};

export default TNDateFormattedTimestamp;
