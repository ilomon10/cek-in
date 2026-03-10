export const generateSimpleHash = (
  value: string,
  isAlphanumeric: boolean = false,
) => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // Constrain to 32-bit integer
  }

  // If alphanumeric is requested, convert to unsigned and Base36
  return isAlphanumeric ? (hash >>> 0).toString(36) : hash;
};
