import React from 'react';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Versions
export const REACT_VERSION = React.version;

// Git

export function getGitRevision() {
  return require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim()
    .slice(0, 7);
}

export function getGitRef() {
  return require('child_process')
    .execSync('git symbolic-ref --short HEAD')
    .toString()
    .trim();
}

export function getCommitMessageFromSha(sha: string) {
  return require('child_process')
    .execSync(`git log -1 --pretty=%B ${sha}`)
    .toString()
    .trim();
}

export function getGitAuthorFromSha(sha: string) {
  return require('child_process')
    .execSync(`git log -1 --pretty=%an ${sha}`)
    .toString()
    .trim();
}

export function getGitRemote() {
  const foundString = require('child_process')
    .execSync('git remote -v')
    .toString()
    .trim();
  const URLRegex =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  return foundString.match(new RegExp(URLRegex))[0];
}

export const GIT_COMMIT_SHA =
  process.env.GIT_COMMIT_SHA?.slice(0, 7) || getGitRevision();
export const GIT_COMMIT_REF = process.env.GIT_COMMIT_REF || getGitRef();
export const GIT_COMMIT_MESSAGE =
  process.env.GIT_COMMIT_MESSAGE || getCommitMessageFromSha(GIT_COMMIT_SHA);
export const GIT_COMMIT_AUTHOR =
  process.env.GIT_COMMIT_AUTHOR_NAME || getGitAuthorFromSha(GIT_COMMIT_SHA);
