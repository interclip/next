import type { NextApiRequest, NextApiResponse } from 'next';

import { GIT_COMMIT_SHA, REACT_VERSION } from '../../lib/runtimeInfo';

function getGitRevision() {
  return require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim()
    .slice(0, 7);
}

function getGitRemote() {
  const foundString = require('child_process')
    .execSync('git remote -v')
    .toString()
    .trim();
  const URLRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  return foundString.match(new RegExp(URLRegex))[0];
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  res.json({
    status: 'success',
    result: {
      react_version: REACT_VERSION,
      commit: GIT_COMMIT_SHA || getGitRevision(),
      git_remote: getGitRemote(),
    },
  });
}
