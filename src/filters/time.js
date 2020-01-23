import {
  format as dateFormat,
} from 'date-fns';

const time = (value, format) => dateFormat(new Date(value * 1000), format);

export default time;
