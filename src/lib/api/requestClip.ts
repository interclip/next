import { Clip } from '@prisma/client';
import { APIResponse } from 'src/typings/interclip';

interface ClipResponse extends APIResponse {
  result: Clip;
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Calls the set API to create a new clip from a link
 * @param url the URL to create the clip from
 */
export const requestClip = async (
  url: string,
): Promise<ClipResponse | void> => {
  const clipResponse = await fetch(`/api/clip/set?url=${url}`);
  if (!clipResponse.ok) throw new APIError(await clipResponse.text());
  const clip: ClipResponse = await clipResponse.json();

  return clip;
};

/**
 * Calls the get API to get a clip by its corresponding code
 * @param code the code of the clip
 */
export const getClip = async (
  code: string,
): Promise<ClipResponse | void | null> => {
  const clipResponse = await fetch(`/api/clip/get?code=${code}`);
  if (clipResponse.status === 404) return null;
  if (!clipResponse.ok) throw new APIError(await clipResponse.text());
  const clip: ClipResponse = await clipResponse.json();
  return clip;
};
