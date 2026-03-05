interface RBACOptions {
  matchAll?: boolean; // require all roles to match
}

type UserRoles = "system-admin" | "admin" | "designer" | "user";

/**
 * RBAC role checker for "any" or "all" match modes.
 */
export function checkRBAC<T = UserRoles>(
  roles: T[],
  allowedRoles: T[],
  options: RBACOptions = { matchAll: false }
): boolean {
  const userRoles = roles ?? [];
  if (!userRoles.length) return false;

  return options.matchAll
    ? allowedRoles.every((r) => userRoles.includes(r))
    : allowedRoles.some((r) => userRoles.includes(r));
}
