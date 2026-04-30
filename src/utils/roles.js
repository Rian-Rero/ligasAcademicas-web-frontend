const MANAGER_ROLE_KEYWORDS = ['manager', 'president', 'marketing'];

export function hasManagerRole(role) {
  if (!role) return false;

  const normalizedRole = String(role).trim().toLocaleLowerCase('pt-BR');
  return (
    MANAGER_ROLE_KEYWORDS.some((keyword) => normalizedRole.includes(keyword)) ||
    normalizedRole.includes('admin')
  );
}

export function hasAdminRole(role) {
  if (!role) return false;

  const normalizedRole = String(role).trim().toLocaleLowerCase('pt-BR');
  return normalizedRole.includes('admin');
}
