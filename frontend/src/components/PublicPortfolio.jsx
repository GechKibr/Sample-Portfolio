import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE } from '../config/constants'
import Footer from './Footer'

const fetchJson = async (path) => {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json()
}

const groupByCategory = (skills) => {
  return skills.reduce((acc, skill) => {
    const key = skill.category || 'Other'
    acc[key] = acc[key] || []
    acc[key].push(skill)
    return acc
  }, {})
}

const PublicPortfolio = () => {
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [experience, setExperience] = useState([])
  const [tech, setTech] = useState([])
  const [error, setError] = useState('')
  const [isDarkMode] = useState(true)
  const [messageStatus, setMessageStatus] = useState('')
  const [messageForm, setMessageForm] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message_content: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [profiles, projectsData, skillsData, experienceData, techData] =
          await Promise.all([
            fetchJson(`${API_BASE}/profile/`),
            fetchJson(`${API_BASE}/projects/`),
            fetchJson(`${API_BASE}/skills/`),
            fetchJson(`${API_BASE}/experience/`),
            fetchJson(`${API_BASE}/technologies/`),
          ])

        setProfile(profiles[0] || null)
        setProjects(projectsData)
        setSkills(skillsData)
        setExperience(experienceData)
        setTech(techData)
      } catch (err) {
        setError('Unable to load portfolio data. Please try again later.')
      }
    }

    load()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }, [isDarkMode])

  const handleMessageChange = (field, value) => {
    setMessageForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const submitMessage = async () => {
    setMessageStatus('')
    try {
      const response = await fetch(`${API_BASE}/messages/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...messageForm,
          is_read: false,
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to send message. Please try again.')
      }

      setMessageStatus('Message sent successfully.')
      setMessageForm({
        sender_name: '',
        sender_email: '',
        subject: '',
        message_content: '',
      })
    } catch (err) {
      setMessageStatus(err.message)
    }
  }

  const groupedSkills = useMemo(() => groupByCategory(skills), [skills])
  const profilePhoto =
    profile?.profile_photo || profile?.profile_picture_url || profile?.profile_picture || null

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-semibold">
              {profile?.full_name ? profile.full_name.slice(0, 1) : 'P'}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">
                Portfolio
              </p>
              <p className="text-sm text-slate-400">Professional Profile</p>
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap max-w-full">
            <a className="text-slate-300 hover:text-white" href="#overview">
              About me 
            </a>
            <a className="text-slate-300 hover:text-white" href="#projects">
              Projects
            </a>
            <a className="text-slate-300 hover:text-white" href="#skills">
              Skills
            </a>
            <a className="text-slate-300 hover:text-white" href="#tech">
              Tech
            </a>
            <a className="text-slate-300 hover:text-white" href="#experience">
              Experience
            </a>
            <a className="text-slate-300 hover:text-white" href="#contact">
              Contact
            </a>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            {profile?.resume_link ? (
              <a
                href={profile.resume_link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-amber-400 text-slate-950 px-4 py-2 text-sm font-semibold"
              >
                Download Resume
              </a>
            ) : null}
            <Link
              to="/admin"
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-amber-300"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 space-y-10 sm:space-y-12">
          <section
            id="overview"
            className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-8 md:p-12"
          >
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <h1 className="font-display text-4xl md:text-5xl text-slate-100">
                  {profile?.full_name || 'Portfolio'}
                </h1>
                <p className="text-slate-400 mt-2">
                  {profile?.location || 'Remote / Worldwide'}
                </p>
                <p className="mt-6 text-lg text-slate-300 max-w-2xl">
                  {error || profile?.bio_summary || 'No profile data available yet.'}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {profile?.github_link ? (
                    <a
                      href={profile.github_link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
                    >
                      GitHub
                    </a>
                  ) : null}
                  {profile?.live_link ? (
                    <a
                      href={profile.live_link}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200"
                    >
                      Portfolio Site
                    </a>
                  ) : null}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold">
                  Profile Photo
                </p>
                <div className="mt-6 flex items-center justify-center">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-64 w-52 rounded-3xl border border-amber-200/20 object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="h-64 w-52 rounded-3xl border border-amber-200/20 bg-gradient-to-br from-amber-300/20 via-slate-800 to-slate-950 flex items-center justify-center text-slate-200 text-sm">
                      Photo Sample
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="grid lg:grid-cols-[1.5fr_0.5fr] gap-8" id="projects">
            <div className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-3xl text-slate-100">
                  Featured Projects
                </h2>
                <span className="text-sm text-slate-400">
                  {projects.length} projects
                </span>
              </div>
              <div className="mt-6 grid gap-6">
                {projects.length === 0 ? (
                  <p className="text-slate-400">No projects yet.</p>
                ) : (
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="rounded-2xl border border-slate-800 p-5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-semibold text-slate-100">
                          {project.title || 'Untitled Project'}
                        </h3>
                        {project.created_at ? (
                          <span className="text-xs text-slate-400">
                            {new Date(project.created_at).getFullYear()}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-slate-300">
                        {project.description || ''}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        {project.live_link ? (
                          <a
                            className="text-amber-600"
                            href={project.live_link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Live
                          </a>
                        ) : null}
                        {project.github_link ? (
                          <a
                            className="text-slate-300"
                            href={project.github_link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            GitHub
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div
                id="skills"
                className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-6"
              >
                <h3 className="font-display text-2xl text-slate-100">
                  Skills
                </h3>
                <div className="mt-4 space-y-4">
                  {Object.keys(groupedSkills).length === 0 ? (
                    <p className="text-slate-400">No skills yet.</p>
                  ) : (
                    Object.entries(groupedSkills).map(([category, items]) => (
                      <div key={category}>
                        <p className="text-xs uppercase tracking-widest text-slate-400">
                          {category}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {items.map((skill) => (
                            <span
                              key={skill.id}
                              className="px-3 py-1 rounded-full bg-slate-800 text-sm text-slate-200"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div
                id="tech"
                className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-6"
              >
                <h3 className="font-display text-2xl text-slate-100">
                  Tech Stack
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tech.length === 0 ? (
                    <p className="text-slate-400">No technologies yet.</p>
                  ) : (
                    tech.map((item) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-sm"
                      >
                        {item.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          <section
            id="experience"
            className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-8"
          >
            <h2 className="font-display text-3xl text-slate-100">
              Experience
            </h2>
            <div className="mt-6 space-y-4">
              {experience.length === 0 ? (
                <p className="text-slate-400">No experience yet.</p>
              ) : (
                experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="rounded-2xl border border-slate-800 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-slate-100">
                        {exp.job_title || 'Role'}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {exp.start_date || ''}
                        {exp.end_date
                          ? ` - ${exp.end_date}`
                          : exp.is_current
                            ? ' - Present'
                            : ''}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-2">
                      {exp.company_name || ''}
                    </p>
                    <p className="text-slate-300 mt-3">
                      {exp.responsibilities || ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section
            id="contact"
            className="rounded-3xl bg-slate-950/70 border border-slate-800 shadow-2xl p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl text-slate-100">
                  Write a message
                </h2>
                <p className="text-slate-400 mt-2">
                  Let me know how I can help. I respond quickly.
                </p>
              </div>
              {messageStatus ? (
                <span className="text-sm text-amber-300">{messageStatus}</span>
              ) : null}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">
                  Name
                </label>
                <input
                  type="text"
                  value={messageForm.sender_name}
                  onChange={(event) =>
                    handleMessageChange('sender_name', event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  value={messageForm.sender_email}
                  onChange={(event) =>
                    handleMessageChange('sender_email', event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-400">
                  Subject
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(event) =>
                    handleMessageChange('subject', event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-slate-400">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={messageForm.message_content}
                  onChange={(event) =>
                    handleMessageChange('message_content', event.target.value)
                  }
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <button
              onClick={submitMessage}
              className="mt-6 rounded-full bg-amber-400 text-slate-950 px-6 py-3 text-sm font-semibold"
            >
              Send message
            </button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PublicPortfolio
