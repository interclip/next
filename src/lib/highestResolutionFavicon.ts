/**
 * Returns the highest resolution favicon from a provided list
 * 
 * For example, for a list of favicons that looks like this: 
 * ```
 * [
    'https://www.youtube.com/s/desktop/0ac1422e/img/favicon_32x32.png',
    'https://www.youtube.com/s/desktop/0ac1422e/img/favicon_48x48.png',
    'https://www.youtube.com/s/desktop/0ac1422e/img/favicon_96x96.png',
    'https://www.youtube.com/s/desktop/0ac1422e/img/favicon_144x144.png',
    'https://www.youtube.com/s/desktop/0ac1422e/img/favicon.ico'
  ]
  ``` 
  it will return `https://www.youtube.com/s/desktop/0ac1422e/img/favicon_144x144.png`, because it has the biggest resolution
 * @param faviconsList an array of favicon URLs
 */
const getBestFavicon = (faviconsList: string[]): string | undefined => {
  if (!Array.isArray(faviconsList)) {
    // Malformed input
    return undefined;
  }

  if (faviconsList.length === 1) {
    return faviconsList.at(0);
  }

  const matchesResolutionRegex = new RegExp(/\d{1,5}x\d{1,5}/);
  const sizedFavicons = faviconsList.filter((favicon) =>
    favicon.match(matchesResolutionRegex),
  );

  const faviconSizes = [];
  for (const favicon of sizedFavicons) {
    const sizeString = favicon.match(matchesResolutionRegex)![0];
    const sizeResolutions = sizeString.split('x').map((s) => parseInt(s));
    const sideSize = sizeResolutions[0] * sizeResolutions[1];
    faviconSizes.push(sideSize);
  }
  const highestResFavicon =
    sizedFavicons[faviconSizes.indexOf(Math.max(...faviconSizes))];

  return faviconSizes.length > 1 ? highestResFavicon : faviconsList.at(-1);
};

export default getBestFavicon;
