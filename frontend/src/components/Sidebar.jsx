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
    <nav className="space-y-3 ml-0 pl-0">
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-lg p-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
            {initials}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
              User
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {userLabel || 'Admin'}
            </p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-700 p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            Layout
          </p>
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
        <p className="mt-6 text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
          Sections
        </p>
        <div className="mt-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item)}
              title={item.title}
              className={`w-full text-left px-4 py-2 rounded-xl font-semibold transition ${
                activeResource.key === item.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.title}
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
