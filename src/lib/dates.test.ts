import { dateAddDays } from './dates';

test('Days are added to a date correctly', () => {
  const date = new Date(2019, 0, 1);
  const result = dateAddDays(date, 1);

  expect(result).toEqual(new Date(2019, 0, 2));
});

test('Days are subtracted from a date correctly', () => {
  const date = new Date(2019, 0, 1);
  const result = dateAddDays(date, -1);

  expect(result).toEqual(new Date(2018, 11, 31));
});
