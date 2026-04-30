export function buildAdminRequestErrorMessage(
  err,
  fallback,
  errorMessages = {},
) {
  const code = err?.response?.data?.httpCode ?? err?.response?.status;
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(' | ');
  }

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return errorMessages[code] || fallback;
}
