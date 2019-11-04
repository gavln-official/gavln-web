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
      const formatedValue = (size / baseValue).toFixed(2)
        .replace('.00', '');

      return `${formatedValue} ${units[i]}`;
    }
  }

  return value;
};

export default filesize;
