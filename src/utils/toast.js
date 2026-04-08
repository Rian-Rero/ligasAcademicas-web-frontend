import { toast } from 'react-toastify';

const fallbackByType = {
  success: 'Operação realizada com sucesso',
  error: 'Não foi possível concluir a operação',
  info: 'Confira as informações enviadas',
  warning: 'Atenção aos dados informados',
};

const prefixByType = {
  success: 'Sucesso',
  error: 'Erro',
  info: 'Info',
  warning: 'Aviso',
};

const optionsByType = {
  success: { autoClose: 3200 },
  error: { autoClose: 5200 },
  info: { autoClose: 4200 },
  warning: { autoClose: 4500 },
};

function normalizeMessage(message, fallback) {
  if (typeof message !== 'string') return fallback;

  const parsedMessage = message.trim();
  return parsedMessage.length ? parsedMessage : fallback;
}

function buildToastMessage(type, message) {
  const fallback = fallbackByType[type] ?? fallbackByType.info;
  const prefix = prefixByType[type] ?? prefixByType.info;

  return `${prefix}: ${normalizeMessage(message, fallback)}`;
}

export function notifySuccess(message, options = {}) {
  return toast.success(buildToastMessage('success', message), {
    ...optionsByType.success,
    ...options,
  });
}

export function notifyError(message, options = {}) {
  return toast.error(buildToastMessage('error', message), {
    ...optionsByType.error,
    ...options,
  });
}

export function notifyInfo(message, options = {}) {
  return toast.info(buildToastMessage('info', message), {
    ...optionsByType.info,
    ...options,
  });
}

export function notifyWarning(message, options = {}) {
  return toast.warning(buildToastMessage('warning', message), {
    ...optionsByType.warning,
    ...options,
  });
}
