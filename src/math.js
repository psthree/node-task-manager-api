const calculateTip = (total, tipPercent = 0.3) => total + total * tipPercent;

const fahrenheitToCelsius = temp => {
  return (temp - 32) / 1.8;
};

const celsiusToFahrenheit = temp => {
  return temp * 1.8 + 32;
};

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      //number must be positive
      if (a < 0 || b < 0) {
        reject('Numbers must be positive');
      }
      resolve(a + b);
    }, 2000);
  });
};
module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add
};
