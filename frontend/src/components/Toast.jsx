const Toast = ({ message }) => {
  if (!message) return null

  return (
    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 text-sm">
      {message}
    </div>
  )
}

export default Toast
