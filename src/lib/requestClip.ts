import { Clip } from '@prisma/client';

interface ClipResponse extends APIResponse {
  result: Clip;
}

export const requestClip = async (
  url: string,
): Promise<ClipResponse | void> => {
  const clipResponse = await fetch(`/api/clip/set?url=${url}`);
  if (!clipResponse.ok) throw new Error(await clipResponse.text());
  const clip: ClipResponse = await clipResponse.json();

  return clip;
};

export const getClip = async (
  code: string,
): Promise<ClipResponse | void | null> => {
  const clipResponse = await fetch(`/api/clip/get?code=${code}`);
  if (clipResponse.status === 404) return null;
  if (!clipResponse.ok) throw new Error(await clipResponse.text());
  const clip: ClipResponse = await clipResponse.json();
  return clip;
};
