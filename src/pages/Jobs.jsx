import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJobs } from '../hooks/useJobs'
import '../assets/styles/jobs.css'

// ... (iconlar o'sha)

const CITIES = ['Баары', 'Бишкек', 'Ош', 'Жалал-Абад']
const JOB_TYPES = [
  { value: 'all', label: 'Баары' },
  { value: 'full_time', label: 'Толук жумуш' },
  { value: 'part_time', label: 'Жарым жумуш' },
  { value: 'remote', label: 'Алыстан' },
]
const TYPE_LABELS = { full_time: 'Толук', part_time: 'Жарым', remote: 'Алыстан', contract: 'Келишим' }
const TYPE_COLORS = { full_time: 'green', part_time: 'orange', remote: 'blue', contract: 'purple' }

function Jobs() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('Баары')
  const [jobType, setJobType] = useState('all')
  const [salaryMin, setSalaryMin] = useState(0)
  const [sortBy, setSortBy] = useState('newest')

  const filters = useMemo(() => ({
    search, city, job_type: jobType, salary_min: salaryMin
  }), [search, city, jobType, salaryMin])

  const { jobs, loading } = useJobs(filters)

  const sorted = useMemo(() => {
    if (sortBy === 'salary_high') return [...jobs].sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0))
    if (sortBy === 'salary_low') return [...jobs].sort((a, b) => (a.salary_min || 0) - (b.salary_min || 0))
    return jobs
  }, [jobs, sortBy])

  const resetFilters = () => {
    setCity('Баары'); setJobType('all'); setSalaryMin(0); setSearch('')
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `${hours} саат мурун`
    return `${Math.floor(hours / 24)} күн мурун`
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <div className="jobs-header-inner">
          <div>
            <h1>Иш орундары</h1>
            <p>{sorted.length} жарнама табылды</p>
          </div>
          <div className="jobs-header-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Иш же компания издөө..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        </div>
      </div>

      <div className="jobs-layout">
        <aside className="jobs-filter">
          <div className="filter-header">
            <span className="filter-title">Фильтр</span>
            <button className="filter-reset" onClick={resetFilters}>Тазалоо</button>
          </div>

          <div className="filter-group">
            <div className="filter-label">Шаар</div>
            {CITIES.map(c => (
              <label key={c} className={`filter-option ${city === c ? 'active' : ''}`}>
                <input type="radio" name="city" checked={city === c} onChange={() => setCity(c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-label">Иш түрү</div>
            {JOB_TYPES.map(t => (
              <label key={t.value} className={`filter-option ${jobType === t.value ? 'active' : ''}`}>
                <input type="radio" name="type" checked={jobType === t.value} onChange={() => setJobType(t.value)} />
                <span>{t.label}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <div className="filter-label">
              Минималдуу маяна
              <span className="salary-val">{salaryMin.toLocaleString()} сом</span>
            </div>
            <input
              type="range" min="0" max="100000" step="5000"
              value={salaryMin} onChange={e => setSalaryMin(+e.target.value)}
              className="salary-range"
            />
            <div className="salary-marks"><span>0</span><span>50,000</span><span>100,000</span></div>
          </div>

          <div className="filter-cta">
            <p>Иш орду барбы?</p>
            <button onClick={() => navigate('/post/new?type=job')}>+ Жарнама берүү</button>
          </div>
        </aside>

        <div className="jobs-main">
          <div className="jobs-toolbar">
            <span className="jobs-count">{sorted.length} жарнама</span>
            <div className="sort-wrap">
              <span>Иреттөө:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Жаңысы</option>
                <option value="salary_high">Маяна: жогору</option>
                <option value="salary_low">Маяна: төмөн</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="jobs-loading">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="job-skeleton" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="jobs-empty">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Жарнама табылган жок</div>
              <div className="empty-sub">Фильтрлерди өзгөртүп көрүңүз</div>
              <button onClick={resetFilters}>Фильтрлерди тазалоо</button>
            </div>
          ) : (
            <div className="job-list">
              {sorted.map((job, i) => (
                <div
                  key={job.id}
                  className="job-list-item"
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="jli-left">
                    <div className="jli-logo">{job.profiles?.full_name?.[0] || job.title?.[0]}</div>
                  </div>
                  <div className="jli-center">
                    <div className="jli-top">
                      <h3 className="jli-title">{job.title}</h3>
                    </div>
                    <div className="jli-company">{job.profiles?.full_name || 'Компания'}</div>
                    <div className="jli-desc">{job.description}</div>
                    <div className="jli-tags">
                      <span className={`jli-type ${TYPE_COLORS[job.job_type] || 'green'}`}>
                        {TYPE_LABELS[job.job_type] || job.job_type}
                      </span>
                      <span className="jli-tag">📍 {job.location}</span>
                    </div>
                  </div>
                  <div className="jli-right">
                    <div className="jli-salary">
                      {job.salary || `${job.salary_min?.toLocaleString()} – ${job.salary_max?.toLocaleString()}`}
                      <span> сом</span>
                    </div>
                    <div className="jli-time">{timeAgo(job.created_at)}</div>
                    <button
                      className="jli-apply"
                      onClick={e => { e.stopPropagation(); navigate(`/jobs/${job.id}`) }}
                    >
                      Арыз берүү
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs