const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700" style={{ background: 'var(--bg-gradient)' }}>
      <div className="max-w-7xl mx-auto px-0 py-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        
        <p>
             Powered by a Django backend and a React frontend, styled with Tailwind CSS. © 2026 | Designed & Developed by Getachew Kibr in Gondar, Ethiopia.
        </p>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
