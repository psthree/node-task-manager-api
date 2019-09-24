const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  add
} = require('../src/math');

test('Should calculate tip', () => {
  const total = calculateTip(10, 0.3);
  expect(total).toBe(13);
});

test('Should calculate tip with default tip', () => {
  const total = calculateTip(10);
  expect(total).toBe(13);
});

test('Should convert fahrenheit to Celsius 32 to 0', () => {
  const temp = fahrenheitToCelsius(32);
  expect(temp).toBe(0);
});

test('Should convert Celsius to fahrenheit to 32', () => {
  const temp = celsiusToFahrenheit(0);
  expect(temp).toBe(32);
});

// need done for async testing
test('Should add 2 numbers async', done => {
  add(1, 1).then(sum => {
    expect(sum).toBe(2);
    done();
  });
});

//instead of using done
test('Should add 2 numbers async/await', async () => {
  const sum = await add(1, 2);
  expect(sum).toBe(3);
});
