export function normalizeId(value) {
  return String(value || '');
}

export function isSameId(left, right) {
  return normalizeId(left) === normalizeId(right);
}

export function buildRequestErrorMessage(err, fallback) {
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

  return fallback;
}

export function formatRole(role, fallback = 'Sem papel') {
  if (!role) return fallback;

  return String(role)
    .replace(/[-_]/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) =>
      word ? word[0].toLocaleUpperCase('pt-BR') + word.slice(1) : '',
    )
    .join(' ');
}

export function toLowerPtBr(value) {
  return String(value || '').toLocaleLowerCase('pt-BR');
}

export function filterBySearch(items, query, fieldsFactory) {
  const normalizedQuery = toLowerPtBr(query).trim();
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    fieldsFactory(item).some((field) =>
      toLowerPtBr(field).includes(normalizedQuery),
    ),
  );
}

export function mapById(items) {
  return items.reduce((acc, item) => {
    acc[normalizeId(item?._id)] = item;
    return acc;
  }, {});
}
