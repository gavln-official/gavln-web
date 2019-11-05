function formatTime(seconds) {
  let value = seconds;

  const values = [];
  if (value >= 3600) {
    values.push((value / 3600).toFixed(0).padStart(2, '0'));
    value %= 3600;
  } else {
    values.push('00');
  }

  if (value >= 60) {
    values.push((value / 60).toFixed(0).padStart(2, '0'));
    value %= 60;
  } else {
    values.push('00');
  }

  values.push(value.toFixed(0).padStart(2, '0'));

  return values.join(':');
}

export default {
  formatTime,
};
