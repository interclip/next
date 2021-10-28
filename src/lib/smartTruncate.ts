const truncate = (url: URL, maxLength = 50) => {
  const text = url.toString();
  const simplifiedURL = `${url.host}${url.pathname}`;

  if (text.length <= maxLength) {
    return text;
  } else if (simplifiedURL.length < maxLength) {
    return simplifiedURL === text ? simplifiedURL : `${simplifiedURL}...`;
  } else {
    return `${text.substring(0, maxLength)}...`;
  }
};

export default truncate;
