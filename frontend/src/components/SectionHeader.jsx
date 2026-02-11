const SectionHeader = ({ activeResource, apiBase }) => {
  return (
    <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 shadow-lg p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-slate-900 dark:text-slate-100">
            {activeResource.title}
          </h2>
        </div>
        <div className="rounded-2xl bg-slate-900 text-white px-4 py-3 text-sm">
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

export default SectionHeader
