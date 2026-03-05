// eslint-disable @typescript-eslint/no-explicit-any
type ParsedQuery = Record<string, any>

export function parseQueryString(queryString: string): ParsedQuery {
  const params = new URLSearchParams(queryString)
  const result: ParsedQuery = {}

  for (const [key, value] of params.entries()) {
    // Convert 'where[id][in]' => ['where', 'id', 'in']
    const keys = key.replace(/\]/g, '').split('[')

    // eslint-disable @typescript-eslint/no-explicit-any
    let current: any = result

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        // Assign value to the deepest key
        current[k] = value.includes(',') ? value.split(',') : value
      } else {
        // Create the nested structure if it doesn't exist
        if (!(k in current)) {
          current[k] = {}
        }
        current = current[k]
      }
    })
  }

  return result
}
