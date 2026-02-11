import { useEffect, useMemo, useState } from 'react'
import { buildPayload, emptyFormFor, formatFieldValue } from '../utils/formUtils'

const ResourceManager = ({ resource, authToken, apiBase, onToast }) => {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formState, setFormState] = useState(() =>
    emptyFormFor(resource.fields)
  )
  const isMessageResource = resource.key === 'messages'
  const [fieldOptions, setFieldOptions] = useState({})

  const apiFetch = async (path, options = {}) => {
    const headers = new Headers(options.headers || {})
    if (authToken) {
      headers.set('Authorization', `Basic ${authToken}`)
    }
    const hasBody = options.body !== undefined && options.body !== null
    if (hasBody && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
    const response = await fetch(path, {
      ...options,
      headers,
    })
    if (!response.ok) {
      let message = `Request failed (${response.status})`
      try {
        const data = await response.json()
        message = data.detail || JSON.stringify(data)
      } catch (err) {
        message = response.statusText || message
      }
      throw new Error(message)
    }
    if (response.status === 204) return null
    return response.json()
  }

  const loadItems = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await apiFetch(`${apiBase}/${resource.endpoint}/`)
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [resource.endpoint])

  useEffect(() => {
    const loadOptions = async () => {
      const optionFields = resource.fields.filter(
        (field) => field.optionsEndpoint
      )
      if (optionFields.length === 0) {
        setFieldOptions({})
        return
      }

      try {
        const entries = await Promise.all(
          optionFields.map(async (field) => {
            const data = await apiFetch(
              `${apiBase}/${field.optionsEndpoint}/`
            )
            return [field.name, Array.isArray(data) ? data : []]
          })
        )
        setFieldOptions(Object.fromEntries(entries))
      } catch (err) {
        setFieldOptions({})
      }
    }

    loadOptions()
  }, [resource.key])

  const visibleFields = useMemo(() => resource.fields, [resource.fields])

  const getOptionLabel = (field, option) => {
    if (!option) return ''
    return option[field.optionLabel] || option.name || String(option.id)
  }

  const getOptionValue = (option) => option?.id

  const formatDisplayValue = (field, value) => {
    if (field.type === 'relation') {
      const options = fieldOptions[field.name] || []
      const match = options.find((option) => option.id === value)
      return match ? getOptionLabel(field, match) : String(value ?? '')
    }
    if (field.type === 'multi-select') {
      const options = fieldOptions[field.name] || []
      if (!Array.isArray(value)) return ''
      return value
        .map((item) => options.find((option) => option.id === item))
        .filter(Boolean)
        .map((option) => getOptionLabel(field, option))
        .join(', ')
    }
    if (field.type === 'checkbox') {
      return value ? 'Yes' : 'No'
    }
    if (Array.isArray(value)) {
      return value.join(', ')
    }
    return String(value ?? '')
  }

  const startCreate = () => {
    if (isMessageResource) return
    setEditingItem(null)
    setFormState(emptyFormFor(resource.fields))
  }

  const startEdit = (item) => {
    setEditingItem(item)
    const nextState = emptyFormFor(resource.fields)
    resource.fields.forEach((field) => {
      nextState[field.name] = formatFieldValue(field, item[field.name])
    })
    setFormState(nextState)
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    setError('')
    const payload = buildPayload(resource.fields, formState)
    const hasFile = resource.fields.some(
      (field) => field.type === 'file' && payload[field.name] instanceof File
    )
    let requestBody = payload
    let requestMethod = editingItem ? 'PUT' : 'POST'

    if (hasFile) {
      const formData = new FormData()
      resource.fields.forEach((field) => {
        if (field.readOnly) return
        const value = payload[field.name]
        if (value === null || value === undefined || value === '') {
          return
        }
        if (field.type === 'array') {
          value.forEach((item) => formData.append(field.name, item))
          return
        }
        formData.append(field.name, value)
      })
      requestBody = formData
      if (editingItem) {
        requestMethod = 'PATCH'
      }
    }
    try {
      if (editingItem) {
        await apiFetch(`${apiBase}/${resource.endpoint}/${editingItem.id}/`, {
          method: requestMethod,
          body: hasFile ? requestBody : JSON.stringify(payload),
        })
        onToast(`${resource.title} updated`)
      } else if (!isMessageResource) {
        await apiFetch(`${apiBase}/${resource.endpoint}/`, {
          method: 'POST',
          body: hasFile ? requestBody : JSON.stringify(payload),
        })
        onToast(`${resource.title} created`)
      } else {
        return
      }
      startCreate()
      await loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (isMessageResource) return
    if (!window.confirm('Delete this item?')) return
    setIsSaving(true)
    setError('')
    try {
      await apiFetch(`${apiBase}/${resource.endpoint}/${itemId}/`, {
        method: 'DELETE',
      })
      onToast('Item deleted')
      await loadItems()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-lg p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl text-slate-900 dark:text-slate-100">
              {resource.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage {resource.title.toLowerCase()} data.
            </p>
          </div>
          {!isMessageResource ? (
            <button
              onClick={startCreate}
              className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-slate-200"
            >
              New entry
            </button>
          ) : null}
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm table-fixed">
            <thead className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <tr>
                {visibleFields.map((field) => (
                  <th
                    key={field.name}
                    className="py-2 pr-4"
                  >
                    {field.label}
                  </th>
                ))}
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={visibleFields.length + 1}>
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-500 dark:text-slate-400" colSpan={visibleFields.length + 1}>
                    No entries yet.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                    {visibleFields.map((field) => (
                      <td
                        key={field.name}
                        className="py-3 pr-4 text-slate-600 dark:text-slate-300"
                      >
                        {formatDisplayValue(field, item[field.name])}
                      </td>
                    ))}
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-amber-700 font-semibold"
                      >
                        {isMessageResource ? 'Respond' : 'Edit'}
                      </button>
                      {!isMessageResource ? (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-rose-600 font-semibold"
                        >
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl text-slate-900 dark:text-slate-100">
            {editingItem
              ? isMessageResource
                ? 'Respond to message'
                : 'Edit entry'
              : isMessageResource
                ? 'Select a message'
                : 'Create entry'}
          </h3>
          {editingItem ? (
            <button
              onClick={startCreate}
              className="text-sm font-semibold text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Clear
            </button>
          ) : null}
        </div>
        <div className="mt-6 grid gap-4">
          {resource.fields.map((field) => (
            <div key={field.name}>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  rows={4}
                  readOnly={field.readOnly}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              ) : field.type === 'select' ? (
                <select
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  disabled={field.readOnly}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'relation' ? (
                <select
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  disabled={field.readOnly}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select</option>
                  {(fieldOptions[field.name] || []).map((option) => (
                    <option key={option.id} value={option.id}>
                      {getOptionLabel(field, option)}
                    </option>
                  ))}
                </select>
              ) : field.type === 'multi-select' ? (
                <select
                  multiple
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: Array.from(event.target.selectedOptions).map(
                        (option) => option.value
                      ),
                    }))
                  }
                  disabled={field.readOnly}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {(fieldOptions[field.name] || []).map((option) => (
                    <option key={option.id} value={option.id}>
                      {getOptionLabel(field, option)}
                    </option>
                  ))}
                </select>
              ) : field.type === 'checkbox' ? (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formState[field.name])}
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        [field.name]: event.target.checked,
                      }))
                    }
                    disabled={field.readOnly}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Enabled
                  </span>
                </div>
              ) : field.type === 'file' ? (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        [field.name]: event.target.files?.[0] || null,
                      }))
                    }
                    disabled={field.readOnly}
                    className="block w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-amber-400 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
                  />
                  {formState[field.name] ? (
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Selected: {formState[field.name].name}
                    </p>
                  ) : null}
                </div>
              ) : (
                <input
                  type={field.type}
                  value={formState[field.name]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      [field.name]: event.target.value,
                    }))
                  }
                  readOnly={field.readOnly}
                  placeholder={field.placeholder || ''}
                  className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              )}
            </div>
          ))}
        </div>
        {error ? (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm">
            {error}
          </div>
        ) : null}
        <button
          onClick={handleSubmit}
          disabled={isSaving || (isMessageResource && !editingItem)}
          className="mt-6 w-full rounded-xl bg-amber-500 text-slate-900 py-3 font-semibold shadow-lg shadow-amber-500/40 hover:bg-amber-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving
            ? 'Saving...'
            : editingItem
              ? isMessageResource
                ? 'Save response'
                : 'Update entry'
              : isMessageResource
                ? 'Select a message'
                : 'Create entry'}
        </button>
      </div>
    </div>
  )
}

export default ResourceManager
