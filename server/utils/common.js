const isNumber = (val) => !isNaN(val) && !isNaN(parseFloat(val));

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const formatDuration = (duration) => {
  const milliseconds = ms(duration);
  return isNumber(milliseconds) ? milliseconds : null;
};

module.exports = { isNumber, sleep, formatDuration };
