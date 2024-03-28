export function extractPathAndParams(url: string) {
  const parsedUrl = new URL(url);
  const pathAndParams = `${parsedUrl.pathname.slice(1)}${parsedUrl.search}`;

  return pathAndParams;
}
