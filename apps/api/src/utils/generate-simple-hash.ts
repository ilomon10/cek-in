export const generateSimpleHash = (value: string, isAlphanumeric: boolean = false) => {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0 // Constrain to 32-bit signed integer
  }

  // Use >>> 0 to convert the signed bit to an unsigned 32-bit integer
  const unsignedHash = hash >>> 0

  return isAlphanumeric ? unsignedHash.toString(36) : unsignedHash
}
