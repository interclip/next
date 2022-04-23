import { filesEndpoint, proxyURL } from './constants';
import { proxied as imgProxy } from './image';

export const getEmbed = (url: string): HTMLElement | undefined => {
  const urlData = new URL(url);
  const extension = urlData.pathname.slice(
    urlData.pathname.lastIndexOf('.') + 1,
  );

  const shouldProxy = new URL(filesEndpoint).host !== urlData.host;

  let element;
  switch (extension) {
    // Images
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
    case 'avif':
      element = document.createElement('img');
      element.src = imgProxy(url);
      break;

    // Natively supported embeds
    case 'mp4':
    case 'webm':

    case 'mp3':
    case 'ogg':
    case 'wav':

    case 'pdf':
      element = document.createElement('embed');
      element.src = shouldProxy ? `${proxyURL}?url=${url}` : url;
      break;

    // file types supported by the Google Drive viewer
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'pdf':
    case 'pages':
    case 'eps':
    case 'ps':
    case 'ttf':
    case 'xps':
      element = document.createElement('iframe');
      element.src = `https://drive.google.com/viewerng/viewer?embedded=true&url=${url}`;
  }
  if (element) {
    element.style.width = '100%';
    element.style.height = '100%';
    return element;
  }
};
