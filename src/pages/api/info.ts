import type { NextApiRequest, NextApiResponse } from 'next';
import { APIResponse } from 'src/typings/interclip';

import {
  getGitRemote,
  getGitRevision,
  GIT_COMMIT_SHA,
  REACT_VERSION,
} from '../../lib/runtimeInfo';

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30');
  res.json({
    status: 'success',
    result: {
      react_version: REACT_VERSION,
      commit: GIT_COMMIT_SHA || getGitRevision(),
      git_remote: getGitRemote(),
    },
  });
}
