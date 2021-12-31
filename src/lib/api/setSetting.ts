import { User } from '@prisma/client';
import { APIResponse } from 'src/typings/interclip';

import { APIError } from './requestClip';

interface UserResponse extends APIResponse {
  result: User;
}

/**
 * Calls the get API to change the user settings
 * @param params the fields to alter and their respective values as key-value pairs
 */
export const setSettings = async (params: {
  [key: string]: string;
}): Promise<UserResponse | void | null> => {
  let stringifiedParams = '';
  for (const key of Object.keys(params)) {
    stringifiedParams += `${encodeURIComponent(key)}:${encodeURIComponent(
      params[key],
    )}`;
  }
  const settingsResponse = await fetch(
    `/api/account/setDetails?params=${stringifiedParams}`,
  );
  if (settingsResponse.status === 404) return null;
  if (!settingsResponse.ok) throw new APIError(await settingsResponse.text());
  const clip: UserResponse = await settingsResponse.json();
  return clip;
};
