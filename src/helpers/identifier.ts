export function getIdentifier(url: string) {
  const initialSegments = url.split('embedded/');

  if (initialSegments.length < 2) {
    return '';
  }

  const finalSegments = initialSegments[1].split('/');
  const key = finalSegments[0];

  return key.replace(/^(https|http|file)/gi, '');
}
