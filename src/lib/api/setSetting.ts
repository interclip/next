import { User } from '@prisma/client';
import { ErrorResponse, SuccessResponse } from 'src/typings/interclip';

import { APIError } from './client/requestClip';

export type UserResponse = SuccessResponse<User> | ErrorResponse;

/**
 * Calls the get API to change the user settings
 * @param params the fields to alter and their respective values as key-value pairs
 * @param user optionally, one can provide an email identifier to make changes to another user account
 */
export const setSettings = async (
  params: {
    [key: string]: string;
  },
  user?: string,
): Promise<UserResponse | void | null> => {
  const settingsResponse = await fetch(
    `/api/account/setDetails?params=${encodeURIComponent(
      JSON.stringify(params),
    )}${user ? `&address=${user}` : ''}`,
  );
  if (!settingsResponse.ok && settingsResponse.status >= 500)
    throw new APIError(await settingsResponse.text());
  const settingsChanged: UserResponse = await settingsResponse.json();
  if (settingsChanged.status === 'error')
    throw new APIError(settingsChanged.result);
  return settingsChanged;
};
