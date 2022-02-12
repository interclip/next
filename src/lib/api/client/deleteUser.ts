interface ErrorResponse {
  status: 'error';
  result: string;
}

type UserDeletionResponse = null | ErrorResponse;

/**
 * Calls the get API to delete a user
 * @param user the email of the user which should be deleted
 */
export const deleteAccount = async (user: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fetch(
      user ? `/api/account/delete?address=${user}` : '/api/account/delete',
      {
        method: 'POST',
      },
    ).then(async (deletionResponse) => {
      if (deletionResponse.status === 204) resolve('Deleted successfully');
      if (!deletionResponse.ok && deletionResponse.status !== 400)
        reject(await deletionResponse.text());
      const settingsChanged: UserDeletionResponse =
        await deletionResponse.json();
      if (settingsChanged!.status === 'error') reject(settingsChanged!.result);
    });
  });
};
