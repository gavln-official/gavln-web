import {
  format as dateFormat,
} from 'date-fns';

const time = (_value, format) => {
  // 后端返回的时间戳不是ms为单位，统一转成js用的13位时间戳
  const value = _value * (10 ** (13 - String(_value).length));
  return dateFormat(new Date(value), format);
};

export default time;
