import { Link } from 'react-router-dom'

const AdminHeader = ({ isDarkMode, onToggleTheme, onLogout }) => {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Admin Console
          </p>
          <h1 className="font-display text-2xl text-slate-900 dark:text-slate-100">
            Portfolio Control Room
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-slate-200"
          >
            Public view
          </Link>
          <button
            onClick={onToggleTheme}
            className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-slate-200"
          >
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">Logged in</span>
          <button
            onClick={onLogout}
            className="rounded-full border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-900 dark:hover:border-slate-200"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
