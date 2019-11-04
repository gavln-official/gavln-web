const baseSize = 1024;
const units = [
  'B',
  'KB',
  'MB',
  'GB',
  'TB',
];

const filesize = (value) => {
  const size = parseFloat(value);
  for (let i = units.length - 1; i >= 0; i -= 1) {
    const baseValue = baseSize ** i;

    if (size >= baseValue) {
      let fValue = (size / baseValue).toFixed(2);

      if (fValue.substring(fValue.length - 3) === '.00') {
        fValue = fValue.substring(0, fValue.length - 3);
      }

      return `${fValue} ${units[i]}`;
    }
  }

  return value;
};

export default filesize;
