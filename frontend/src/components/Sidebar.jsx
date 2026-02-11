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
  isCompact,
  onToggleCompact,
  sidebarWidth,
  onWidthChange,
}) => {
  const initials = buildInitials(userLabel || 'Admin')

  return (
    <nav className="space-y-3 ml-0 pl-0">
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          {!isCompact ? (
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                User
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {userLabel || 'Admin'}
              </p>
            </div>
          ) : null}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            Layout
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-600 dark:text-slate-300">Compact</span>
            <button
              onClick={onToggleCompact}
              className={`h-7 w-12 rounded-full border border-slate-300 dark:border-slate-600 transition ${
                isCompact ? 'bg-slate-900' : 'bg-white dark:bg-slate-800'
              }`}
              aria-label="Toggle compact sidebar"
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow-md transition ${
                  isCompact ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="mt-4">
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
              className="mt-2 w-full"
            />
          </div>
        </div>
        {!isCompact ? (
          <p className="mt-6 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            Sections
          </p>
        ) : null}
        <div className={`mt-4 space-y-2 ${isCompact ? 'flex flex-col items-center' : ''}`}>
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item)}
              title={item.title}
              className={`w-full ${isCompact ? 'max-w-[56px] text-center' : 'text-left'} px-4 py-2 rounded-xl font-semibold transition ${
                activeResource.key === item.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isCompact ? item.title.slice(0, 1) : item.title}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-300 text-slate-900 p-6 shadow-xl">
        <p className="text-xs uppercase tracking-widest font-semibold">Quick Tip</p>
        <p className="mt-3 text-sm">
          Fill in Profile first, then link projects and skills using the profile ID.
        </p>
      </div>
    </nav>
  )
}

export default Sidebar
