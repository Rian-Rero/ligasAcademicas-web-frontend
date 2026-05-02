const MANAGER_ROLE_KEYWORDS = ['manager', 'president', 'marketing'];

function normalizeRoleKeys(roleKeys) {
  if (!roleKeys) return [];

  if (Array.isArray(roleKeys)) {
    return roleKeys.map((roleKey) => String(roleKey).trim().toLowerCase());
  }

  return [String(roleKeys).trim().toLowerCase()];
}

export function hasManagerRole(roleKeys) {
  const normalizedRoleKeys = normalizeRoleKeys(roleKeys);
  if (normalizedRoleKeys.length === 0) return false;

  return normalizedRoleKeys.some(
    (roleKey) =>
      roleKey.includes('admin') ||
      MANAGER_ROLE_KEYWORDS.some((keyword) => roleKey.includes(keyword)),
  );
}

export function hasAdminRole(roleKeys) {
  const normalizedRoleKeys = normalizeRoleKeys(roleKeys);
  if (normalizedRoleKeys.length === 0) return false;

  return normalizedRoleKeys.some((roleKey) => roleKey.includes('admin'));
}
