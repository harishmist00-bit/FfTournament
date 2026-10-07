import axios from 'axios';

export class ApiError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Converts any thrown value into a message that is safe to show users. Never leaks raw backend payloads. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server. Check your connection and try again.';
    if (err.response.status === 401) return 'Your session has expired. Please log in again.';
    if (err.response.status === 403) return 'You do not have permission to do that.';
    if (err.response.status === 404) return 'We could not find what you were looking for.';
    if (err.response.status >= 500) return 'The server had a problem. Please try again shortly.';
  }
  return 'Something went wrong. Please try again.';
}
