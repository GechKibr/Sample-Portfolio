import { useState } from 'react'

const LoginPage = ({ onLogin, isLoading, error }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-stretch">
        <div className="rounded-3xl p-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-widest">
            Portfolio Management
          </div>
          <h1 className="font-display text-4xl md:text-5xl mt-6 text-slate-900 dark:text-slate-100 leading-tight">
            Portfolio Command Center
          </h1>
          <div className="mt-10 grid gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="user name "
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="********"
              />
            </div>
            {error ? (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-rose-700 text-sm">
                {error}
              </div>
            ) : null}
            <button
              onClick={() => onLogin(username, password)}
              disabled={isLoading}
              className="w-full rounded-xl bg-slate-900 text-white py-3 font-semibold shadow-lg shadow-slate-900/30 hover:bg-slate-800 transition"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
        <div className="rounded-3xl p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-800 text-white shadow-xl">
          <h2 className="font-display text-3xl">Code is a journey, not a destination.</h2>
          <ul className="mt-6 space-y-4 text-sm text-slate-200">
            <li>Curate featured projects and tech stacks.</li>
            <li>Update skills, experience, and certifications.</li>
            <li>Review and mark client messages.</li>
          </ul>
          <div className="mt-10 rounded-2xl bg-white/10 border border-white/20 px-6 py-5">
            <p className="text-sm text-slate-200">
              Tip: Create a Django superuser to manage secure access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
