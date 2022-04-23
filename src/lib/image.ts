export const imageDomains = [
  'avatar.tobi.sh',
  'avatars.githubusercontent.com',
  'images.weserv.nl',
  'cdn.discordapp.com',
];

export const proxied = (url: string, width?: number, height?: number) => {
  const domain = new URL(url).hostname;
  if (imageDomains.includes(domain)) {
    return url;
  }

  if (!width || !height) {
    return `https://images.weserv.nl/?url=${url}`;
  }

  return `https://images.weserv.nl/?url=${url}&w=${width}&h=${height}`;
};
