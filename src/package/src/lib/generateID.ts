import crypto from 'crypto';

/**
 * Creates an Interclip-compatible random ID
 * @param length the length of the ID to generate
 * @returns a random ID
 */
export const getClipHash = (url: string): string => {
  const digest = crypto.createHash('sha512').update(url).digest('hex');
  return BigInt('0x' + digest).toString(36);
};
