import { User } from '@prisma/client';
import { ErrorResponse, SuccessResponse } from 'src/typings/interclip';

import { APIError } from './client/requestClip';

type UserResponse = SuccessResponse<User> | ErrorResponse;

/**
 * Calls the get API to change the user settings
 * @param params the fields to alter and their respective values as key-value pairs
 */
export const setSettings = async (params: {
  [key: string]: string;
}): Promise<UserResponse | void | null> => {
  const settingsResponse = await fetch(
    `/api/account/setDetails?params=${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  );
  if (!settingsResponse.ok && settingsResponse.status !== 400)
    throw new APIError(await settingsResponse.text());
  const settingsChanged: UserResponse = await settingsResponse.json();
  if (settingsChanged.status === 'error')
    throw new APIError(settingsChanged.result);
  return settingsChanged;
};
