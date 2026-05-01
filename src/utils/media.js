export function resolveMediaUrl(url) {
  if (!url) return null;

  const normalizedUrl = String(url).trim();
  if (!normalizedUrl) return null;

  if (
    normalizedUrl.startsWith('http://') ||
    normalizedUrl.startsWith('https://') ||
    normalizedUrl.startsWith('blob:') ||
    normalizedUrl.startsWith('data:')
  ) {
    return normalizedUrl;
  }

  if (normalizedUrl.startsWith('/')) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) return normalizedUrl;

    return `${backendUrl}${normalizedUrl}`;
  }

  return normalizedUrl;
}
