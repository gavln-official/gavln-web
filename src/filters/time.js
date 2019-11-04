import {
  format as dateFormat,
} from 'date-fns';

const time = (value, format) => dateFormat(new Date(value), format);

export default time;
