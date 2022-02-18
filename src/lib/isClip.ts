import { maximumCodeLength, minimumCodeLength } from './constants';

export const isValidClipCode = (code: string): boolean => {
  if (code.length < minimumCodeLength || code.length > maximumCodeLength) {
    console.log("Doesn't match: " + code.length);

    return false;
  } else if (!code.match(new RegExp(/^[A-Za-z0-9]{5,99}$/))) {
    console.log("Doesn't match");
    return false;
  }
  console.log('matches');
  return true;
};
