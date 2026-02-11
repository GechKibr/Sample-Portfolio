import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminHeader from './components/AdminHeader'
import LoginPage from './components/LoginPage'
import ResourceManager from './components/ResourceManager'
import SectionHeader from './components/SectionHeader'
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
  const [isDarkMode, setIsDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  )
  const [userLabel, setUserLabel] = useState(() =>
    localStorage.getItem('adminUser')
  )
  const [isSidebarCompact, setIsSidebarCompact] = useState(() =>
    localStorage.getItem('sidebarCompact') === 'true'
  )
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const stored = Number(localStorage.getItem('sidebarWidth'))
    return Number.isNaN(stored) || stored === 0 ? 220 : stored
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2800)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('sidebarCompact', String(isSidebarCompact))
  }, [isSidebarCompact])

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
      <AdminHeader
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-0 py-8">
          <div
            className="admin-grid"
            style={{ '--sidebar-width': `${sidebarWidth}px` }}
          >
            <Sidebar
              navItems={navItems}
              activeResource={activeResource}
              onSelect={setActiveResource}
              userLabel={userLabel}
              isCompact={isSidebarCompact}
              onToggleCompact={() =>
                setIsSidebarCompact((prev) => !prev)
              }
              sidebarWidth={sidebarWidth}
              onWidthChange={setSidebarWidth}
            />
            <section className="space-y-6">
              <SectionHeader activeResource={activeResource} apiBase={API_BASE} />
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
