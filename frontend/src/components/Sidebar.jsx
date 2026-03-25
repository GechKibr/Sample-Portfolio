const buildInitials = (label) => {
  if (!label) return 'A'
  const parts = label.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const Sidebar = ({
  navItems,
  activeResource,
  onSelect,
  userLabel,
  sidebarWidth,
  onWidthChange,
}) => {
  const initials = buildInitials(userLabel || 'Admin')

  return (
    <nav className="space-y-4">
      <div className="overflow-hidden border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-800 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-semibold">
                Administrator
              </p>
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {userLabel || 'Admin'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">
            Navigation
          </p>
          <div className="mt-3 space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onSelect(item)}
                title={item.title}
                className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors border ${
                  activeResource.key === item.key
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
                    : 'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">
            Layout
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Width</span>
              <span>{sidebarWidth}px</span>
            </div>
            <input
              type="range"
              min="180"
              max="300"
              value={sidebarWidth}
              onChange={(event) => onWidthChange(Number(event.target.value))}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none bg-slate-200 accent-slate-800 dark:bg-slate-700 dark:accent-slate-200"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Sidebar
