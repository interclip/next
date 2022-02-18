import { maximumCodeLength, minimumCodeLength } from './constants';

export const isValidClipCode = (code: string): boolean => {
  if (code.length < minimumCodeLength || code.length > maximumCodeLength) {
    return false;
  } else if (!code.match(new RegExp(/^[A-Za-z0-9]{5,99}$/))) {
    return false;
  }
  return true;
};
