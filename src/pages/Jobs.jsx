import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/jobs.css'

const ALL_JOBS = [
  { id: 1, title: 'React Developer', company: 'TechBishkek', location: 'Бишкек', salary_min: 60000, salary_max: 100000, type: 'full_time', category: 'IT', description: 'React, Redux, TypeScript билген адис издейбиз', time: '2 саат мурун', verified: true },
  { id: 2, title: 'UI/UX Дизайнер', company: 'Creative Studio', location: 'Ош', salary_min: 50000, salary_max: 80000, type: 'full_time', category: 'Дизайн', description: 'Figma, Adobe XD менен иштей алган дизайнер', time: '5 саат мурун', verified: true },
  { id: 3, title: 'Бухгалтер', company: 'Finance KG', location: 'Бишкек', salary_min: 40000, salary_max: 65000, type: 'full_time', category: 'Финансы', description: '1C программасын жакшы билген бухгалтер', time: '1 күн мурун', verified: false },
  { id: 4, title: 'Маркетолог', company: 'Digital KG', location: 'Бишкек', salary_min: 55000, salary_max: 90000, type: 'remote', category: 'Маркетинг', description: 'SMM, таргет жарнама боюнча тажрыйбасы бар', time: '1 күн мурун', verified: true },
  { id: 5, title: 'Продавец-консультант', company: 'MegaStore', location: 'Ош', salary_min: 30000, salary_max: 50000, type: 'part_time', category: 'Соода', description: 'Сатуу тажрыйбасы бар жигиттер/кыздар', time: '2 күн мурун', verified: false },
  { id: 6, title: 'Водитель', company: 'LogisticsKG', location: 'Жалал-Абад', salary_min: 40000, salary_max: 60000, type: 'full_time', category: 'Логистика', description: 'B, C категория айдоочулук күбөлүгү болгон', time: '2 күн мурун', verified: false },
  { id: 7, title: 'Python Developer', company: 'StartupBishkek', location: 'Бишкек', salary_min: 70000, salary_max: 120000, type: 'remote', category: 'IT', description: 'Django, FastAPI менен иштей алган', time: '3 күн мурун', verified: true },
  { id: 8, title: 'Мугалим (Математика)', company: 'Мектеп №5', location: 'Жалал-Абад', salary_min: 25000, salary_max: 40000, type: 'full_time', category: 'Билим', description: '5-11 класс окуучуларына математика', time: '3 күн мурун', verified: false },
  { id: 9, title: 'HR менеджер', company: 'BigCompany KG', location: 'Бишкек', salary_min: 45000, salary_max: 75000, type: 'full_time', category: 'HR', description: 'Рекрутинг жана HR процесстери', time: '4 күн мурун', verified: true },
  { id: 10, title: 'Повар', company: 'Ресторан Манас', location: 'Ош', salary_min: 35000, salary_max: 55000, type: 'full_time', category: 'Тамак-аш', description: 'Улуттук жана европалык тамактарды бышырган', time: '5 күн мурун', verified: false },
  { id: 11, title: 'Node.js Developer', company: 'FinTech KG', location: 'Бишкек', salary_min: 80000, salary_max: 130000, type: 'remote', category: 'IT', description: 'Node.js, PostgreSQL, Redis тажрыйбасы', time: '5 күн мурун', verified: true },
  { id: 12, title: 'Медайым', company: 'Клиника Жашоо', location: 'Бишкек', salary_min: 30000, salary_max: 50000, type: 'full_time', category: 'Медицина', description: 'Орто медициналык билими болгон', time: '6 күн мурун', verified: true },
]

const CATEGORIES = ['Баары', 'IT', 'Дизайн', 'Финансы', 'Маркетинг', 'Соода', 'Логистика', 'Билим', 'HR', 'Тамак-аш', 'Медицина']
const CITIES = ['Баары', 'Бишкек', 'Ош', 'Жалал-Абад']
const JOB_TYPES = [
  { value: 'all', label: 'Баары' },
  { value: 'full_time', label: 'Толук жумуш' },
  { value: 'part_time', label: 'Жарым жумуш' },
  { value: 'remote', label: 'Алыстан' },
]

function Jobs() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Баары')
  const [city, setCity] = useState('Баары')
  const [jobType, setJobType] = useState('all')
  const [salaryMin, setSalaryMin] = useState(0)
  const [sortBy, setSortBy] = useState('newest')

  const filtered = useMemo(() => {
    let jobs = ALL_JOBS.filter(job => {
      const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Баары' || job.category === category
      const matchCity = city === 'Баары' || job.location === city
      const matchType = jobType === 'all' || job.type === jobType
      const matchSalary = job.salary_min >= salaryMin
      return matchSearch && matchCat && matchCity && matchType && matchSalary
    })

    if (sortBy === 'salary_high') jobs = [...jobs].sort((a, b) => b.salary_max - a.salary_max)
    if (sortBy === 'salary_low') jobs = [...jobs].sort((a, b) => a.salary_min - b.salary_min)

    return jobs
  }, [search, category, city, jobType, salaryMin, sortBy])

  const typeLabels = { full_time: 'Толук', part_time: 'Жарым', remote: 'Алыстан', contract: 'Келишим' }
  const typeColors = { full_time: 'green', part_time: 'orange', remote: 'blue', contract: 'purple' }

  const resetFilters = () => {
    setCategory('Баары')
    setCity('Баары')
    setJobType('all')
    setSalaryMin(0)
    setSearch('')
  }

  return (
    <div className="jobs-page">

      {/* Page Header */}
      <div className="jobs-header">
        <div className="jobs-header-inner">
          <div>
            <h1>Иш орундары</h1>
            <p>{filtered.length} жарнама табылды</p>
          </div>
          <div className="jobs-header-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Иш же компания издөө..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>
      </div>

      <div className="jobs-layout">

        {/* ── LEFT FILTER ── */}
        <aside className="jobs-filter">

          <div className="filter-header">
            <span className="filter-title">Фильтр</span>
            <button className="filter-reset" onClick={resetFilters}>Тазалоо</button>
          </div>

          {/* Category */}
          <div className="filter-group">
            <div className="filter-label">Категория</div>
            {CATEGORIES.map(cat => (
              <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="category"
                  checked={category === cat}
                  onChange={() => setCategory(cat)}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>

          {/* City */}
          <div className="filter-group">
            <div className="filter-label">Шаар</div>
            {CITIES.map(c => (
              <label key={c} className={`filter-option ${city === c ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="city"
                  checked={city === c}
                  onChange={() => setCity(c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>

          {/* Job type */}
          <div className="filter-group">
            <div className="filter-label">Иш түрү</div>
            {JOB_TYPES.map(t => (
              <label key={t.value} className={`filter-option ${jobType === t.value ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  checked={jobType === t.value}
                  onChange={() => setJobType(t.value)}
                />
                <span>{t.label}</span>
              </label>
            ))}
          </div>

          {/* Salary */}
          <div className="filter-group">
            <div className="filter-label">
              Минималдуу маяна
              <span className="salary-val">{salaryMin.toLocaleString()} сом</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={salaryMin}
              onChange={e => setSalaryMin(+e.target.value)}
              className="salary-range"
            />
            <div className="salary-marks">
              <span>0</span>
              <span>50,000</span>
              <span>100,000</span>
            </div>
          </div>

          {/* Post job CTA */}
          <div className="filter-cta">
            <p>Иш орду барбы?</p>
            <button onClick={() => navigate('/post/new?type=job')}>
              + Жарнама берүү
            </button>
          </div>
        </aside>

        {/* ── RIGHT LIST ── */}
        <div className="jobs-main">

          {/* Sort */}
          <div className="jobs-toolbar">
            <span className="jobs-count">{filtered.length} жарнама</span>
            <div className="sort-wrap">
              <span>Иреттөө:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Жаңысы</option>
                <option value="salary_high">Маяна: жогору</option>
                <option value="salary_low">Маяна: төмөн</option>
              </select>
            </div>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="jobs-empty">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Жарнама табылган жок</div>
              <div className="empty-sub">Фильтрлерди өзгөртүп көрүңүз</div>
              <button onClick={resetFilters}>Фильтрлерди тазалоо</button>
            </div>
          ) : (
            <div className="job-list">
              {filtered.map((job, i) => (
                <div
                  key={job.id}
                  className="job-list-item"
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  <div className="jli-left">
                    <div className="jli-logo">{job.company[0]}</div>
                  </div>

                  <div className="jli-center">
                    <div className="jli-top">
                      <h3 className="jli-title">{job.title}</h3>
                      {job.verified && (
                        <span className="jli-verified" title="Текшерилген компания">✓ Текшерилген</span>
                      )}
                    </div>
                    <div className="jli-company">{job.company}</div>
                    <div className="jli-desc">{job.description}</div>
                    <div className="jli-tags">
                      <span className={`jli-type ${typeColors[job.type]}`}>{typeLabels[job.type]}</span>
                      <span className="jli-tag">📍 {job.location}</span>
                      <span className="jli-tag">🗂 {job.category}</span>
                    </div>
                  </div>

                  <div className="jli-right">
                    <div className="jli-salary">
                      {job.salary_min.toLocaleString()} – {job.salary_max.toLocaleString()}
                      <span> сом</span>
                    </div>
                    <div className="jli-time">{job.time}</div>
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