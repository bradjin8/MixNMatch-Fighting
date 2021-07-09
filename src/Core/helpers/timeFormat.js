import moment from 'moment';

export const timeFormat = (timeStamp) => {
  if (timeStamp) {
    if (moment(timeStamp).isValid()) {
      return '';
    }
    if (moment().diff(moment.unix(timeStamp.seconds), 'days') == 0) {
      return moment.unix(timeStamp.seconds).format('H:mm');
    }
    return moment.unix(timeStamp.seconds).fromNow();
  }
  return ' ';
};
