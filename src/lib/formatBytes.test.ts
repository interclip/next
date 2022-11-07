import formatBytes from './formatBytes';

test('Formatting works', () => {
  const bytes = 56_640;
  const formatted = formatBytes(bytes);
  expect(formatted).toBe('55.31 KB');
});

test('No bytes are correctly formatted', () => {
  const bytes = 0;
  const formatted = formatBytes(bytes);
  expect(formatted).toBe('0 Bytes');
});
