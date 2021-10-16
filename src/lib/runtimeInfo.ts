import React from 'react';

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Versions
export const REACT_VERSION = React.version;

// Git
export const GIT_COMMIT_SHA = process.env.GIT_COMMIT_SHA?.slice(0, 7);
export const GIT_COMMIT_REF = process.env.GIT_COMMIT_REF;
