import { Clip } from '@prisma/client';
import { User } from 'next-auth';
import { ErrorResponse, SuccessResponse } from 'src/typings/interclip';

import { APIError } from './requestClip';

type UsersResponse = SuccessResponse<User[]> | ErrorResponse;
type ClipsResponse = SuccessResponse<Clip[]> | ErrorResponse;

export const initialItemsToLoad = 15;

/**
 * Fetches all users from the database, with the starting index of `from`
 */
export const fetchUsers = async (
  from: number,
  setMoreUsersToLoad: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<User[]> => {
  const response = await fetch(
    `/api/admin/getUsers?from=${from}&limit=${
      from === 0 ? initialItemsToLoad : 5
    }`,
  );
  if (!response.ok) {
    if (response.status === 500) {
      throw new APIError('Not ok');
    }
  } else if (response.status === 204) {
    setMoreUsersToLoad(false);
    return [];
  }

  const data: UsersResponse = await response.json();

  if (data.status === 'error') {
    throw new APIError(data.result);
  }

  return data.result;
};

/**
 * Fetches all clips from the database, with the starting index of `from`
 */
export const fetchClips = async (
  from: number,
  take: number,
  setMoreClipsToLoad?: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<Clip[]> => {
  const response = await fetch(
    `/api/admin/getClips?from=${from}&limit=${take}`,
  );
  if (!response.ok) {
    throw new APIError('Not ok');
  } else if (response.status === 204) {
    if (setMoreClipsToLoad) {
      setMoreClipsToLoad(false);
    }
    return [];
  }

  const data: ClipsResponse = await response.json();

  if (data.status === 'error') {
    throw new APIError(data.result);
  }

  return data.result;
};
