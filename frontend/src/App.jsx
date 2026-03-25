import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminHeader from './components/AdminHeader'
import LoginPage from './components/LoginPage'
import ResourceManager from './components/ResourceManager'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'
import Footer from './components/Footer'
import PublicPortfolio from './components/PublicPortfolio'
import { API_BASE } from './config/constants'
import { resourceConfigs } from './config/resourceConfigs'

const AdminApp = () => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('adminAuth')
  )
  const [activeResource, setActiveResource] = useState(resourceConfigs[0])
  const [userLabel, setUserLabel] = useState(() =>
    localStorage.getItem('adminUser')
  )
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = Number(localStorage.getItem('sidebarWidth'))
    return Number.isNaN(stored) || stored === 0 ? 220 : stored
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [toast, setToast] = useState('')
  const [createModalResource, setCreateModalResource] = useState(null)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [accountForm, setAccountForm] = useState({
    username: userLabel || '',
    password: '',
    confirmPassword: '',
  })
  const [accountError, setAccountError] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const clamped = Math.min(Math.max(sidebarWidth, 180), 300)
    if (clamped !== sidebarWidth) {
      setSidebarWidth(clamped)
      return
    }
    localStorage.setItem('sidebarWidth', String(clamped))
  }, [sidebarWidth])

  const handleLogin = async (username, password) => {
    setIsLoggingIn(true)
    setLoginError('')
    try {
      const token = btoa(`${username}:${password}`)
      const response = await fetch(`${API_BASE}/profile/`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Invalid credentials. Check your username and password.')
      }
      localStorage.setItem('adminAuth', token)
      localStorage.setItem('adminUser', username)
      setAuthToken(token)
      setUserLabel(username)
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    setAuthToken(null)
    setUserLabel(null)
  }

  const navItems = useMemo(() => resourceConfigs, [])
  const addOptions = useMemo(
    () => navItems.filter((item) => item.key !== 'messages'),
    [navItems]
  )

  useEffect(() => {
    setAccountForm((prev) => ({
      ...prev,
      username: userLabel || '',
    }))
  }, [userLabel])

  const handleOpenCreate = (resource) => {
    setActiveResource(resource)
    setCreateModalResource(resource)
  }

  const createLabel = createModalResource
    ? createModalResource.title.endsWith('ies')
      ? `${createModalResource.title.slice(0, -3)}y`
      : createModalResource.title.endsWith('s')
        ? createModalResource.title.slice(0, -1)
        : createModalResource.title
    : ''

  const openAccountModal = () => {
    setAccountError('')
    setAccountForm({
      username: userLabel || '',
      password: '',
      confirmPassword: '',
    })
    setIsAccountModalOpen(true)
  }

  const closeAccountModal = () => {
    if (isSavingAccount) return
    setIsAccountModalOpen(false)
    setAccountError('')
  }

  const handleAccountChange = (field, value) => {
    setAccountForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAccountSave = async () => {
    if (!accountForm.username.trim() || !accountForm.password || !accountForm.confirmPassword) {
      setAccountError('Username, password, and confirm password are required.')
      return
    }

    if (accountForm.password !== accountForm.confirmPassword) {
      setAccountError('Password and confirm password must match.')
      return
    }

    setIsSavingAccount(true)
    setAccountError('')
    try {
      const response = await fetch(`${API_BASE}/auth/credentials/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
        },
        body: JSON.stringify({
          username: accountForm.username.trim(),
          password: accountForm.password,
        }),
      })

      if (!response.ok) {
        let message = 'Unable to update account credentials.'
        try {
          const data = await response.json()
          message = data.detail || message
        } catch {
          // Keep fallback message
        }
        throw new Error(message)
      }

      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
      setToast('Credentials updated. Please sign in with your new details.')
      setAuthToken(null)
      setUserLabel(null)
      closeAccountModal()
    } catch (err) {
      setAccountError(err.message)
    } finally {
      setIsSavingAccount(false)
    }
  }

  if (!authToken) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isLoading={isLoggingIn}
        error={loginError}
      />
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader onLogout={handleLogout} />

      <main className="flex-1">
        <div className="w-full px-0 py-0">
          <div
            className="admin-grid"
            style={{ '--sidebar-width': `${sidebarWidth}px` }}
          >
            <Sidebar
              navItems={navItems}
              activeResource={activeResource}
              onSelect={setActiveResource}
              userLabel={userLabel}
              sidebarWidth={sidebarWidth}
              onWidthChange={setSidebarWidth}
            />
            <section className="space-y-4">
              <div className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">
                  Account Settings
                </p>
                <div className="mt-3">
                  <button
                    onClick={openAccountModal}
                    className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-200"
                  >
                    Edit Username & Password
                  </button>
                </div>
              </div>
              <div className="border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 font-semibold">
                  Add Options
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {addOptions.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => handleOpenCreate(item)}
                      className="border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-200"
                    >
                      New {item.title}
                    </button>
                  ))}
                </div>
              </div>
              <Toast message={toast} />
              <ResourceManager
                resource={activeResource}
                authToken={authToken}
                apiBase={API_BASE}
                onToast={setToast}
              />
            </section>
          </div>
        </div>
      </main>

      {createModalResource ? (
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm p-4 sm:p-8">
          <div className="mx-auto max-w-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <h2 className="font-display text-2xl text-slate-100">
                New {createLabel}
              </h2>
              <button
                onClick={() => setCreateModalResource(null)}
                className="border border-slate-600 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-slate-200"
              >
                Close
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-5">
              <ResourceManager
                resource={createModalResource}
                authToken={authToken}
                apiBase={API_BASE}
                onToast={setToast}
                viewMode="popup-create"
                onCreated={() => setCreateModalResource(null)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {isAccountModalOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm p-4 sm:p-8">
          <div className="mx-auto max-w-xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <h2 className="font-display text-2xl text-slate-100">
                Edit Account Credentials
              </h2>
              <button
                onClick={closeAccountModal}
                className="border border-slate-600 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:border-slate-200"
              >
                Close
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Username
                </label>
                <input
                  type="text"
                  value={accountForm.username}
                  onChange={(event) => handleAccountChange('username', event.target.value)}
                  className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={accountForm.password}
                  onChange={(event) => handleAccountChange('password', event.target.value)}
                  className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={accountForm.confirmPassword}
                  onChange={(event) => handleAccountChange('confirmPassword', event.target.value)}
                  className="mt-2 w-full border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Re-enter password"
                />
              </div>
              {accountError ? (
                <div className="border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {accountError}
                </div>
              ) : null}
              <button
                onClick={handleAccountSave}
                disabled={isSavingAccount}
                className="w-full bg-amber-500 px-3 py-2 font-semibold text-slate-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAccount ? 'Saving...' : 'Save Credentials'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicPortfolio />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
