import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/home.css'

// SVG Icons
const IconBriefcase = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/>
  </svg>
)
const IconShop = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const IconMap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconLocation = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconMoney = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)

// Category SVG Icons
const CatIcons = {
  IT: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  ),
  Design: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  Finance: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Education: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Phone: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  ),
  Car: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><rect x="7" y="14" width="10" height="6" rx="1"/><path d="M5 9l2-4h10l2 4"/>
    </svg>
  ),
  Home: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Clothes: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),
}

const categories = [
  { icon: 'IT', name: 'IT & Технология', count: 234, type: 'job', color: '#eff6ff', iconColor: '#2563eb' },
  { icon: 'Design', name: 'Дизайн', count: 89, type: 'job', color: '#fdf4ff', iconColor: '#9333ea' },
  { icon: 'Finance', name: 'Финансы', count: 156, type: 'job', color: '#f0fdf4', iconColor: '#16a34a' },
  { icon: 'Education', name: 'Билим берүү', count: 98, type: 'job', color: '#fff7ed', iconColor: '#ea580c' },
  { icon: 'Phone', name: 'Телефондор', count: 412, type: 'product', color: '#eff6ff', iconColor: '#2563eb' },
  { icon: 'Car', name: 'Унаалар', count: 287, type: 'product', color: '#fef2f2', iconColor: '#dc2626' },
  { icon: 'Home', name: 'Үй буюмдары', count: 634, type: 'product', color: '#f0fdf4', iconColor: '#16a34a' },
  { icon: 'Clothes', name: 'Кийим-кече', count: 521, type: 'product', color: '#fdf4ff', iconColor: '#9333ea' },
]

const recentJobs = [
  { id: 1, title: 'React Developer', company: 'TechBishkek', location: 'Бишкек', salary: '60,000 – 100,000', type: 'Толук', time: '2 саат' },
  { id: 2, title: 'UI/UX Дизайнер', company: 'Creative Studio', location: 'Ош', salary: '50,000 – 80,000', type: 'Толук', time: '5 саат' },
  { id: 3, title: 'Маркетолог', company: 'Digital KG', location: 'Бишкек', salary: '55,000 – 90,000', type: 'Алыстан', time: '1 күн' },
  { id: 4, title: 'Бухгалтер', company: 'Finance KG', location: 'Бишкек', salary: '40,000 – 65,000', type: 'Толук', time: '1 күн' },
  { id: 5, title: 'Python Developer', company: 'StartupBishkek', location: 'Бишкек', salary: '70,000 – 120,000', type: 'Алыстан', time: '2 күн' },
  { id: 6, title: 'HR менеджер', company: 'BigCompany KG', location: 'Бишкек', salary: '45,000 – 75,000', type: 'Толук', time: '2 күн' },
]

const recentProducts = [
  { id: 1, title: 'iPhone 14 Pro', price: '85,000', condition: 'Жакшы', location: 'Бишкек', icon: 'Phone' },
  { id: 2, title: 'MacBook Pro M2', price: '120,000', condition: 'Жакшы', location: 'Бишкек', icon: 'IT' },
  { id: 3, title: 'Toyota Camry 2020', price: '2,800,000', condition: 'Жаңы сыяктуу', location: 'Ош', icon: 'Car' },
  { id: 4, title: 'Диван угловой', price: '35,000', condition: 'Жакшы', location: 'Жалал-Абад', icon: 'Home' },
  { id: 5, title: 'Samsung 65" TV', price: '45,000', condition: 'Жаңы', location: 'Бишкек', icon: 'IT' },
  { id: 6, title: 'Велосипед Trek', price: '25,000', condition: 'Орточо', location: 'Бишкек', icon: 'Design' },
]

const stats = [
  { icon: <IconUsers />, number: '12,500+', label: 'Колдонуучулар' },
  { icon: <IconBriefcase />, number: '3,800+', label: 'Иш жарнамалары' },
  { icon: <IconShop />, number: '9,200+', label: 'Товарлар' },
  { icon: <IconMap />, number: '45+', label: 'Шаарлар' },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statsRef, statsInView] = useInView()
  const [catRef, catInView] = useInView()
  const [jobsRef, jobsInView] = useInView()
  const [productsRef, productsInView] = useInView()
  const [stepsRef, stepsInView] = useInView()

  return (
    <div className="home">

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-label">
              <span className="live-dot" />
              Кыргызстандын №1 платформасы
            </div>
            <h1 className="hero-h1">
              Иш тап же<br />
              <span>товар сат</span>
            </h1>
            <p className="hero-p">
              Бишкек, Ош, Жалал-Абад жана башка шаарларда —<br className="hero-br" />
              иш жана товар базары бир жерде
            </p>
            <div className="hero-search-box">
              <div className="hero-search">
                <IconSearch />
                <input
                  type="text"
                  placeholder="Иш же товар издөө..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/search?q=${search}`)}
                />
                <button onClick={() => navigate(`/search?q=${search}`)}>Издөө</button>
              </div>
              <div className="hero-quick">
                <span>Популярдуу:</span>
                {['Developer', 'iPhone', 'Дизайнер', 'MacBook'].map(t => (
                  <button key={t} onClick={() => navigate(`/search?q=${t}`)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="hero-btns">
              <button className="hbtn-primary" onClick={() => navigate('/jobs')}>
                <IconBriefcase /> Иш издөө
              </button>
              <button className="hbtn-secondary" onClick={() => navigate('/market')}>
                <IconShop /> Базарга кирүү
              </button>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hv-card hv-card-1">
              <div className="hvc-icon blue"><IconBriefcase /></div>
              <div>
                <div className="hvc-title">React Developer</div>
                <div className="hvc-sub">TechBishkek • 80,000 сом</div>
              </div>
              <div className="hvc-badge">Жаңы</div>
            </div>
            <div className="hv-card hv-card-2">
              <div className="hvc-icon purple"><IconShop /></div>
              <div>
                <div className="hvc-title">iPhone 14 Pro</div>
                <div className="hvc-sub">Бишкек • 85,000 сом</div>
              </div>
            </div>
            <div className="hv-card hv-card-3">
              <div className="hvc-icon green"><IconCheck /></div>
              <div>
                <div className="hvc-title">Жумушка кабыл алынды!</div>
                <div className="hvc-sub">Бүгүн 14:30</div>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="hv-blob blob1" />
            <div className="hv-blob blob2" />
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <section className="stats-bar" ref={statsRef}>
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className={`stat-card ${statsInView ? 'visible' : ''}`} style={{ '--d': `${i * 0.1}s` }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-num">{s.number}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CATEGORIES ══ */}
      <section className="section" ref={catRef}>
        <div className="container">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Категориялар</h2>
              <p className="sec-sub">Иш же товар табуу үчүн категория тандаңыз</p>
            </div>
          </div>
          <div className="cat-grid">
            {categories.map((cat, i) => {
              const Icon = CatIcons[cat.icon]
              return (
                <div
                  key={i}
                  className={`cat-item ${catInView ? 'visible' : ''}`}
                  style={{ '--d': `${i * 0.06}s`, '--bg': cat.color, '--ic': cat.iconColor }}
                  onClick={() => navigate(cat.type === 'job' ? '/jobs' : '/market')}
                >
                  <div className="cat-icon-wrap"><Icon /></div>
                  <div className="cat-name">{cat.name}</div>
                  <div className="cat-cnt">{cat.count} жарнама</div>
                  <div className="cat-arr"><IconChevron /></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ RECENT JOBS ══ */}
      <section className="section section-alt" ref={jobsRef}>
        <div className="container">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Акыркы иштер</h2>
              <p className="sec-sub">Жаңы жарыяланган иш орундары</p>
            </div>
            <button className="see-all" onClick={() => navigate('/jobs')}>
              Баарын көрүү <IconArrow />
            </button>
          </div>
          <div className="jobs-list" >
            {recentJobs.map((job, i) => (
              <div
                key={job.id}
                ref={i === 0 ? jobsRef : null}
                className={`job-row ${jobsInView ? 'visible' : ''}`}
                style={{ '--d': `${i * 0.07}s` }}
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="jr-logo">{job.company[0]}</div>
                <div className="jr-info">
                  <div className="jr-title">{job.title}</div>
                  <div className="jr-meta">
                    <span><IconLocation />{job.location}</span>
                    <span><IconClock />{job.time} мурун</span>
                  </div>
                </div>
                <div className="jr-right">
                  <div className="jr-salary"><IconMoney />{job.salary} сом</div>
                  <span className={`jr-type ${job.type === 'Алыстан' ? 'remote' : 'full'}`}>{job.type}</span>
                </div>
                <div className="jr-arrow"><IconChevron /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RECENT PRODUCTS ══ */}
      <section className="section" ref={productsRef}>
        <div className="container">
          <div className="sec-head">
            <div>
              <h2 className="sec-title">Акыркы товарлар</h2>
              <p className="sec-sub">Сатылып жаткан товарлар</p>
            </div>
            <button className="see-all" onClick={() => navigate('/market')}>
              Баарын көрүү <IconArrow />
            </button>
          </div>
          <div className="products-grid">
            {recentProducts.map((p, i) => {
              const Icon = CatIcons[p.icon]
              return (
                <div
                  key={p.id}
                  className={`prod-card ${productsInView ? 'visible' : ''}`}
                  style={{ '--d': `${i * 0.08}s` }}
                  onClick={() => navigate(`/market/${p.id}`)}
                >
                  <div className="pc-img">
                    <Icon />
                    <span className="pc-cond">{p.condition}</span>
                  </div>
                  <div className="pc-body">
                    <div className="pc-title">{p.title}</div>
                    <div className="pc-price">{p.price} сом</div>
                    <div className="pc-loc"><IconLocation />{p.location}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="section steps-section" ref={stepsRef}>
        <div className="container">
          <div className="sec-head centered">
            <h2 className="sec-title">Кантип иштейт?</h2>
            <p className="sec-sub">Үч жөнөкөй кадам менен баштаңыз</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', icon: <IconUsers />, title: 'Катталуу', desc: 'Бекер катталып, профилиңизди бир мүнөттө толтуруңуз' },
              { n: '02', icon: <IconBriefcase />, title: 'Жарнама жайгаштыруу', desc: 'Иш же товар жөнүндө жарнама жазып, сүрөт кошуңуз' },
              { n: '03', icon: <IconCheck />, title: 'Байланышуу', desc: 'Кызыккандар менен түз байланышып, макулдашыңыз' },
            ].map((s, i) => (
              <div key={i} className={`step ${stepsInView ? 'visible' : ''}`} style={{ '--d': `${i * 0.15}s` }}>
                <div className="step-n">{s.n}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {i < 2 && <div className="step-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-text">
              <h2>Азыр баштаңыз!</h2>
              <p>Миңдеген адамдар Bazario аркылуу иш жана товар табууда</p>
              <ul className="cta-list">
                {['Бекер катталуу', 'Жарнаманы бир мүнөттө жайгаштыруу', 'Сатуучулар менен түз байланыш'].map(t => (
                  <li key={t}><IconCheck />{t}</li>
                ))}
              </ul>
            </div>
            <div className="cta-btns">
              <button className="cta-btn-main" onClick={() => navigate('/auth?tab=register')}>
                Бекер катталуу <IconArrow />
              </button>
              <button className="cta-btn-out" onClick={() => navigate('/jobs')}>
                Иштерди көрүү
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      
    </div>
  )
}