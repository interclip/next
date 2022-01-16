import { Clip } from '@prisma/client';

interface ErrorResponse {
  status: 'error';
  result: string;
}

interface SuccessResponse<T> {
  status: 'success';
  result: T;
}

type ClipResponse = SuccessResponse<Clip> | ErrorResponse;

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
export const requestClip = async (url: string): Promise<ClipResponse> => {
  const clipResponse = await fetch(`/api/clip/set?url=${url}`);
  if (clipResponse.status === 500) {
    return { status: 'error', result: await clipResponse.text() };
  }
  return await clipResponse.json();
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
  if (clipResponse.status === 429) {
    return {
      status: 'error',
      result: 'Too many requests, please try in a couple of seconds.',
    };
  }
  if (!clipResponse.ok) {
    return { status: 'error', result: await clipResponse.text() };
  }
  return await clipResponse.json();
};
