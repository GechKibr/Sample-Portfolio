const readOnlyFields = new Set([
  'id',
  'created_at',
  'received_date',
  'ip_address',
])

const fileLikeFields = new Set(['image', 'profile_picture'])

export const emptyFormFor = (fields) =>
  fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = false
    } else if (field.type === 'file') {
      acc[field.name] = null
    } else {
      acc[field.name] = ''
    }
    return acc
  }, {})

export const parseArrayInput = (value) => {
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((item) => !Number.isNaN(item))
}

export const buildPayload = (fields, form) => {
  return fields.reduce((acc, field) => {
    if (readOnlyFields.has(field.name)) {
      return acc
    }
    const rawValue = form[field.name]
    if (field.type === 'number') {
      const parsed = Number(rawValue)
      acc[field.name] = Number.isNaN(parsed) ? null : parsed
      return acc
    }
    if (field.type === 'checkbox') {
      acc[field.name] = Boolean(rawValue)
      return acc
    }
    if (field.type === 'file') {
      acc[field.name] = rawValue instanceof File ? rawValue : null
      return acc
    }
    if (field.type === 'array') {
      acc[field.name] = parseArrayInput(rawValue)
      return acc
    }
    if (fileLikeFields.has(field.name)) {
      acc[field.name] = rawValue ? rawValue : null
      return acc
    }
    acc[field.name] = rawValue
    return acc
  }, {})
}

export const formatFieldValue = (field, value) => {
  if (value === null || value === undefined) return ''
  if (field.type === 'array') {
    return Array.isArray(value) ? value.join(', ') : ''
  }
  if (field.type === 'checkbox') {
    return Boolean(value)
  }
  if (field.type === 'file') {
    return null
  }
  return String(value)
}
