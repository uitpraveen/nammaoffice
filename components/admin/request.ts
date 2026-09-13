export async function adminRequest(url: string, options?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(40000),
    });
  } catch {
    throw new Error(
      "The connection was interrupted. Reload to check whether your change was saved before retrying.",
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      body.error ||
        (response.status === 413
          ? "Choose an image under 3 MB."
          : "The request failed. Please reload and try again."),
    );
  return body;
}
