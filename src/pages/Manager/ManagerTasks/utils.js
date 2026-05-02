export function buildRequestErrorMessage(err, fallback) {
  const responseMessage = err?.response?.data?.message;

  if (Array.isArray(responseMessage)) {
    return responseMessage.join(', ');
  }

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof err?.message === 'string' && err.message.trim()) {
    return err.message;
  }

  return fallback;
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'HIGH':
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#10b981';
    default:
      return '#6b7280';
  }
}

export function getPriorityLabel(priority) {
  switch (priority) {
    case 'HIGH':
      return 'Alta';
    case 'MEDIUM':
      return 'Média';
    case 'LOW':
      return 'Baixa';
    default:
      return priority;
  }
}

export function formatTaskDate(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function isTaskOverdue(dueDate, completed) {
  if (completed) return false;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return new Date(dueDate) < now;
}
