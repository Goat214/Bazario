import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/home.css'

const stats = [
  { number: 12500, suffix: '+', label: 'Колдонуучулар' },
  { number: 3800, suffix: '+', label: 'Жарыяланган иштер' },
  { number: 9200, suffix: '+', label: 'Товарлар' },
  { number: 45, suffix: '+', label: 'Шаарлар' },
]

const categories = [
  { icon: '💼', name: 'IT & Технология', count: 234, type: 'job', color: '#dbeafe', border: '#93c5fd' },
  { icon: '🏗️', name: 'Куруулуу', count: 189, type: 'job', color: '#dcfce7', border: '#86efac' },
  { icon: '📚', name: 'Билим берүү', count: 156, type: 'job', color: '#fef9c3', border: '#fde047' },
  { icon: '🏥', name: 'Медицина', count: 98, type: 'job', color: '#fee2e2', border: '#fca5a5' },
  { icon: '📱', name: 'Телефондор', count: 412, type: 'product', color: '#f3e8ff', border: '#d8b4fe' },
  { icon: '🚗', name: 'Унаалар', count: 287, type: 'product', color: '#ffedd5', border: '#fdba74' },
  { icon: '🏠', name: 'Үй буюмдары', count: 634, type: 'product', color: '#e0f2fe', border: '#7dd3fc' },
  { icon: '👗', name: 'Кийим-кече', count: 521, type: 'product', color: '#fce7f3', border: '#f9a8d4' },
]

const recentJobs = [
  { id: 1, title: 'React Developer', company: 'TechBishkek', location: 'Бишкек', salary: '80,000 сом', type: 'Толук', time: '2 саат' },
  { id: 2, title: 'UI/UX Дизайнер', company: 'Creative Studio', location: 'Ош', salary: '60,000 сом', type: 'Толук', time: '5 саат' },
  { id: 3, title: 'Бухгалтер', company: 'Finance KG', location: 'Бишкек', salary: '55,000 сом', type: 'Толук', time: '1 күн' },
  { id: 4, title: 'Маркетолог', company: 'Digital KG', location: 'Бишкек', salary: '70,000 сом', type: 'Алыстан', time: '1 күн' },
  { id: 5, title: 'Продавец', company: 'MegaStore', location: 'Ош', salary: '45,000 сом', type: 'Жарым', time: '2 күн' },
  { id: 6, title: 'Водитель', company: 'LogisticsKG', location: 'Жалал-Абад', salary: '50,000 сом', type: 'Толук', time: '2 күн' },
]

const recentProducts = [
  { id: 1, title: 'iPhone 14 Pro', price: '85,000 сом', condition: 'Жакшы', location: 'Бишкек', emoji: '📱' },
  { id: 2, title: 'Samsung 65" TV', price: '45,000 сом', condition: 'Жаңы', location: 'Ош', emoji: '📺' },
  { id: 3, title: 'MacBook Pro M2', price: '120,000 сом', condition: 'Жакшы', location: 'Бишкек', emoji: '💻' },
  { id: 4, title: 'Велосипед Trek', price: '25,000 сом', condition: 'Орточо', location: 'Бишкек', emoji: '🚴' },
  { id: 5, title: 'Диван угловой', price: '35,000 сом', condition: 'Жакшы', location: 'Жалал-Абад', emoji: '🛋️' },
  { id: 6, title: 'PlayStation 5', price: '65,000 сом', condition: 'Жаңы', location: 'Бишкек', emoji: '🎮' },
]

// Counter animation hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatItem({ number, suffix, label, start }) {
  const count = useCounter(number, 2000, start)
  return (
    <div className="stat-item">
      <div className="stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

// Intersection observer hook
function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statsRef, statsInView] = useInView()
  const [catRef, catInView] = useInView()
  const [jobsRef, jobsInView] = useInView()
  const [productsRef, productsInView] = useInView()
  const [stepsRef, stepsInView] = useInView()

  return (
    <div className="home">

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <div className="hero-bg-orb orb3" />

        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              🇰🇬 Кыргызстандын №1 платформасы
            </div>

            <h1 className="hero-title">
              <span className="title-line">Иш тап же</span>
              <span className="title-line gradient-text">товар сат</span>
            </h1>

            <p className="hero-subtitle">
              Бишкек, Ош, Жалал-Абад жана башка шаарларда<br />
              иш жана товар базары — бир жерде
            </p>

            <div className="hero-search-wrap">
              <div className="hero-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Иш же товар издөө..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/search?q=${search}`)}
                />
                <button className="search-btn" onClick={() => navigate(`/search?q=${search}`)}>
                  Издөө
                </button>
              </div>
              <div className="hero-tags">
                {['React Developer', 'iPhone', 'Дизайнер', 'MacBook', 'Бухгалтер'].map(tag => (
                  <button key={tag} className="hero-tag" onClick={() => navigate(`/search?q=${tag}`)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="hero-cta">
              <button className="cta-primary" onClick={() => navigate('/jobs')}>
                💼 Иш издөө
              </button>
              <button className="cta-secondary" onClick={() => navigate('/market')}>
                🛍️ Базарга кирүү
              </button>
            </div>
          </div>

          <div className="hero-cards">
            <div className="hcard hcard-1">
              <div className="hcard-icon">💼</div>
              <div>
                <div className="hcard-title">React Developer</div>
                <div className="hcard-sub">TechBishkek • 80,000 сом</div>
              </div>
              <div className="hcard-badge new">Жаңы</div>
            </div>
            <div className="hcard hcard-2">
              <div className="hcard-icon">📱</div>
              <div>
                <div className="hcard-title">iPhone 14 Pro</div>
                <div className="hcard-sub">Бишкек • 85,000 сом</div>
              </div>
            </div>
            <div className="hcard hcard-3">
              <div className="hcard-icon success-icon">✓</div>
              <div>
                <div className="hcard-title">Жумушка кабыл алынды!</div>
                <div className="hcard-sub">Бүгүн 14:30</div>
              </div>
            </div>
            <div className="hcard hcard-4">
              <div className="hcard-icon">👥</div>
              <div>
                <div className="hcard-title">+128 жаңы колдонуучу</div>
                <div className="hcard-sub">Бүгүн</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="stats-section" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatItem key={i} {...s} start={statsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="section" ref={catRef}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Категориялар</h2>
              <p className="section-sub">Иш же товар табуу үчүн категория тандаңыз</p>
            </div>
          </div>
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={i}
                className={`cat-card ${catInView ? 'visible' : ''}`}
                style={{ '--delay': `${i * 0.06}s`, '--bg': cat.color, '--border': cat.border }}
                onClick={() => navigate(cat.type === 'job' ? `/jobs` : `/market`)}
              >
                <div className="cat-emoji">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">{cat.count} жарнама</div>
                <div className="cat-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RECENT JOBS ═══ */}
      <section className="section section-gray" ref={jobsRef}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Акыркы иштер</h2>
              <p className="section-sub">Жаңы жарыяланган иш орундары</p>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/jobs')}>
              Баарын көрүү <span>→</span>
            </button>
          </div>
          <div className="jobs-grid">
            {recentJobs.map((job, i) => (
              <div
                key={job.id}
                className={`job-card ${jobsInView ? 'visible' : ''}`}
                style={{ '--delay': `${i * 0.08}s` }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="jc-top">
                  <div className="jc-logo">{job.company[0]}</div>
                  <span className={`jc-type ${job.type === 'Алыстан' ? 'remote' : ''}`}>{job.type}</span>
                </div>
                <div className="jc-title">{job.title}</div>
                <div className="jc-company">{job.company}</div>
                <div className="jc-footer">
                  <div className="jc-meta">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.salary}</span>
                  </div>
                  <span className="jc-time">{job.time} мурун</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RECENT PRODUCTS ═══ */}
      <section className="section" ref={productsRef}>
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Акыркы товарлар</h2>
              <p className="section-sub">Сатылып жаткан товарлар</p>
            </div>
            <button className="see-all-btn" onClick={() => navigate('/market')}>
              Баарын көрүү <span>→</span>
            </button>
          </div>
          <div className="products-grid">
            {recentProducts.map((p, i) => (
              <div
                key={p.id}
                className={`product-card ${productsInView ? 'visible' : ''}`}
                style={{ '--delay': `${i * 0.08}s` }}
                onClick={() => navigate(`/market/${p.id}`)}
              >
                <div className="pc-image">
                  <span className="pc-emoji">{p.emoji}</span>
                  <span className="pc-condition">{p.condition}</span>
                  <div className="pc-overlay">
                    <span>Көрүү →</span>
                  </div>
                </div>
                <div className="pc-info">
                  <div className="pc-title">{p.title}</div>
                  <div className="pc-price">{p.price}</div>
                  <div className="pc-meta">
                    <span>📍 {p.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="section steps-section" ref={stepsRef}>
        <div className="container">
          <div className="section-head centered">
            <h2 className="section-title">Кантип иштейт?</h2>
            <p className="section-sub">Үч жөнөкөй кадам менен баштаңыз</p>
          </div>
          <div className="steps-grid">
            {[
              { num: '01', icon: '👤', title: 'Катталуу', desc: 'Бекер катталып, профилиңизди бир мүнөттө толтуруңуз' },
              { num: '02', icon: '📝', title: 'Жарнама жайгаштыруу', desc: 'Иш же товар жөнүндө жарнама жазып, сүрөт кошуңуз' },
              { num: '03', icon: '🤝', title: 'Байланышуу', desc: 'Кызыккандар менен түз байланышып, макулдашыңыз' },
            ].map((step, i) => (
              <div
                key={i}
                className={`step-card ${stepsInView ? 'visible' : ''}`}
                style={{ '--delay': `${i * 0.15}s` }}
              >
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
                {i < 2 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div className="cta-orb cta-orb1" />
            <div className="cta-orb cta-orb2" />
            <div className="cta-content">
              <h2>Азыр баштаңыз!</h2>
              <p>Миңдеген адамдар Bazario аркылуу иш жана товар табууда</p>
              <div className="cta-btns">
                <button onClick={() => navigate('/auth?tab=register')}>Бекер катталуу →</button>
                <button className="outline" onClick={() => navigate('/jobs')}>Иштерди көрүү</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">bazar<span>io</span></div>
              <p>Кыргызстандын иш жана товар платформасы. Бишкек, Ош, Жалал-Абад.</p>
              <div className="footer-socials">
                <a href="#" className="social-btn">TG</a>
                <a href="#" className="social-btn">IG</a>
                <a href="#" className="social-btn">FB</a>
              </div>
            </div>
            {[
              { title: 'Платформа', links: [['Иштер', '/jobs'], ['Базар', '/market'], ['Катталуу', '/auth']] },
              { title: 'Жардам', links: [['Байланыш', '#'], ['Эрежелер', '#'], ['Купуялык', '#']] },
            ].map((col, i) => (
              <div key={i} className="footer-col">
                <h4>{col.title}</h4>
                {col.links.map(([label, href]) => (
                  <a key={label} href={href}>{label}</a>
                ))}
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <p>© 2024 Bazario. Бардык укуктар корголгон.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home