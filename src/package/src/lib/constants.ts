export const IS_PROD = process.env.NODE_ENV === 'production';
export const baseUrl = process.env.BASE_URL?.endsWith('/')
  ? process.env.BASE_URL.slice(0, -1)
  : process.env.BASE_URL;
