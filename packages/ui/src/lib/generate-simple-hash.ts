export const generateSimpleHash = (
  value: string,
  isAlphanumeric: boolean = false,
) => {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0; // keep 32-bit
  }

  const unsignedHash = hash >>> 0; // convert to unsigned

  return isAlphanumeric ? unsignedHash.toString(36) : unsignedHash;
};
