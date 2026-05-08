import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/styles/market.css'

// SVG Icons
const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
)
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconLocation = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconHeart = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
)
const IconPhone = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)
const IconLaptop = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)
const IconCar = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
    <rect x="7" y="14" width="10" height="6" rx="1"/>
  </svg>
)
const IconHome = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconShirt = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  </svg>
)
const IconSport = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="10"/>
    <path d="M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M19.07 4.93l-4.24 4.24M9.17 9.17 4.93 19.07"/>
  </svg>
)
const IconKid = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 12h.01M15 12h.01M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
  </svg>
)
const IconMore = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
  </svg>
)

const CAT_ICONS = {
  'Телефондор': IconPhone,
  'Компьютерлер': IconLaptop,
  'Унаалар': IconCar,
  'Үй буюмдары': IconHome,
  'Кийим-кече': IconShirt,
  'Спорт': IconSport,
  'Балдар үчүн': IconKid,
  'Башка': IconMore,
}

const ALL_PRODUCTS = [
  { id: 1, title: 'iPhone 14 Pro 256GB', price: 85000, condition: 'good', category: 'Телефондор', city: 'Бишкек', time: '1 саат мурун', views: 234 },
  { id: 2, title: 'MacBook Pro M2 16"', price: 120000, condition: 'good', category: 'Компьютерлер', city: 'Бишкек', time: '3 саат мурун', views: 189 },
  { id: 3, title: 'Toyota Camry 2020', price: 2800000, condition: 'like_new', category: 'Унаалар', city: 'Ош', time: '5 саат мурун', views: 412 },
  { id: 4, title: 'Samsung 65" QLED TV', price: 45000, condition: 'new', category: 'Үй буюмдары', city: 'Бишкек', time: '1 күн мурун', views: 98 },
  { id: 5, title: 'PlayStation 5', price: 65000, condition: 'like_new', category: 'Башка', city: 'Бишкек', time: '1 күн мурун', views: 321 },
  { id: 6, title: 'Диван угловой', price: 35000, condition: 'good', category: 'Үй буюмдары', city: 'Жалал-Абад', time: '2 күн мурун', views: 76 },
  { id: 7, title: 'Nike Air Max 270', price: 8500, condition: 'new', category: 'Кийим-кече', city: 'Бишкек', time: '2 күн мурун', views: 145 },
  { id: 8, title: 'Велосипед Trek Marlin', price: 25000, condition: 'fair', category: 'Спорт', city: 'Бишкек', time: '3 күн мурун', views: 67 },
  { id: 9, title: 'Samsung Galaxy S23', price: 55000, condition: 'like_new', category: 'Телефондор', city: 'Ош', time: '3 күн мурун', views: 198 },
  { id: 10, title: 'iPad Air 5', price: 70000, condition: 'good', category: 'Компьютерлер', city: 'Бишкек', time: '4 күн мурун', views: 156 },
  { id: 11, title: 'Детская коляска', price: 12000, condition: 'good', category: 'Балдар үчүн', city: 'Жалал-Абад', time: '4 күн мурун', views: 89 },
  { id: 12, title: 'Холодильник LG', price: 28000, condition: 'good', category: 'Үй буюмдары', city: 'Ош', time: '5 күн мурун', views: 112 },
]

const CATEGORIES = ['Баары', 'Телефондор', 'Компьютерлер', 'Унаалар', 'Үй буюмдары', 'Кийим-кече', 'Спорт', 'Балдар үчүн', 'Башка']
const CITIES = ['Баары', 'Бишкек', 'Ош', 'Жалал-Абад']
const CONDITIONS = [
  { value: 'all', label: 'Баары' },
  { value: 'new', label: 'Жаңы' },
  { value: 'like_new', label: 'Жаңы сыяктуу' },
  { value: 'good', label: 'Жакшы' },
  { value: 'fair', label: 'Орточо' },
]
const COND_LABELS = { new: 'Жаңы', like_new: 'Жаңы сыяктуу', good: 'Жакшы', fair: 'Орточо' }
const COND_COLORS = { new: 'cond-new', like_new: 'cond-likenew', good: 'cond-good', fair: 'cond-fair' }

function Market() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Баары')
  const [city, setCity] = useState('Баары')
  const [condition, setCondition] = useState('all')
  const [maxPrice, setMaxPrice] = useState(3000000)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [liked, setLiked] = useState({})

  const filtered = useMemo(() => {
    let items = ALL_PRODUCTS.filter(p => {
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'Баары' || p.category === category
      const matchCity = city === 'Баары' || p.city === city
      const matchCond = condition === 'all' || p.condition === condition
      const matchPrice = p.price <= maxPrice
      return matchSearch && matchCat && matchCity && matchCond && matchPrice
    })
    if (sortBy === 'price_low') items = [...items].sort((a, b) => a.price - b.price)
    if (sortBy === 'price_high') items = [...items].sort((a, b) => b.price - a.price)
    if (sortBy === 'popular') items = [...items].sort((a, b) => b.views - a.views)
    return items
  }, [search, category, city, condition, maxPrice, sortBy])

  const resetFilters = () => {
    setCategory('Баары'); setCity('Баары')
    setCondition('all'); setMaxPrice(3000000); setSearch('')
  }

  const toggleLike = (e, id) => {
    e.stopPropagation()
    setLiked(p => ({ ...p, [id]: !p[id] }))
  }

  return (
    <div className="market-page">

      {/* Header */}
      <div className="market-header">
        <div className="market-header-inner">
          <div>
            <h1>Базар</h1>
            <p>{filtered.length} товар табылды</p>
          </div>
          <div className="mh-right">
            <div className="market-search">
              <IconSearch />
              <input
                type="text"
                placeholder="Товар издөө..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && <button className="s-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}><IconGrid /></button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}><IconList /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="market-layout">

        {/* Filter */}
        <aside className="market-filter">
          <div className="filter-header">
            <span className="filter-title">Фильтр</span>
            <button className="filter-reset" onClick={resetFilters}>Тазалоо</button>
          </div>

          {/* Category */}
          <div className="filter-group">
            <div className="filter-label">Категория</div>
            {CATEGORIES.map(cat => {
              const Icon = CAT_ICONS[cat]
              return (
                <label key={cat} className={`filter-option ${category === cat ? 'active' : ''}`}>
                  <input type="radio" name="cat" checked={category === cat} onChange={() => setCategory(cat)} />
                  {Icon && <span className="fopt-icon"><Icon /></span>}
                  <span>{cat}</span>
                </label>
              )
            })}
          </div>

          {/* City */}
          <div className="filter-group">
            <div className="filter-label">Шаар</div>
            {CITIES.map(c => (
              <label key={c} className={`filter-option ${city === c ? 'active' : ''}`}>
                <input type="radio" name="city" checked={city === c} onChange={() => setCity(c)} />
                <span>{c}</span>
              </label>
            ))}
          </div>

          {/* Condition */}
          <div className="filter-group">
            <div className="filter-label">Абалы</div>
            {CONDITIONS.map(c => (
              <label key={c.value} className={`filter-option ${condition === c.value ? 'active' : ''}`}>
                <input type="radio" name="cond" checked={condition === c.value} onChange={() => setCondition(c.value)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

          {/* Price */}
          <div className="filter-group">
            <div className="filter-label">
              Максималдуу баа
              <span className="price-val">{maxPrice.toLocaleString()} сом</span>
            </div>
            <input
              type="range" min="0" max="3000000" step="10000"
              value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              className="price-range"
            />
            <div className="price-marks"><span>0</span><span>3,000,000</span></div>
          </div>

          {/* Post CTA */}
          <div className="filter-cta">
            <p>Товар сатасызбы?</p>
            <button onClick={() => navigate('/post/new?type=product')}>+ Жарнама берүү</button>
          </div>
        </aside>

        {/* Main */}
        <div className="market-main">
          <div className="market-toolbar">
            <span className="market-count">{filtered.length} товар</span>
            <div className="sort-wrap">
              <span>Иреттөө:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Жаңысы</option>
                <option value="price_low">Баа: арзан</option>
                <option value="price_high">Баа: кымбат</option>
                <option value="popular">Популярдуу</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="market-empty">
              <div className="empty-icon">
                <IconSearch />
              </div>
              <div className="empty-title">Товар табылган жок</div>
              <div className="empty-sub">Фильтрлерди өзгөртүп көрүңүз</div>
              <button onClick={resetFilters}>Фильтрлерди тазалоо</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="products-grid">
              {filtered.map((p, i) => {
                const Icon = CAT_ICONS[p.category] || IconMore
                return (
                  <div
                    key={p.id}
                    className="prod-card"
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onClick={() => navigate(`/market/${p.id}`)}
                  >
                    <div className="pc-img">
                      <Icon />
                      <span className={`pc-cond ${COND_COLORS[p.condition]}`}>{COND_LABELS[p.condition]}</span>
                      <button className={`pc-like ${liked[p.id] ? 'liked' : ''}`} onClick={e => toggleLike(e, p.id)}>
                        <IconHeart />
                      </button>
                    </div>
                    <div className="pc-body">
                      <div className="pc-title">{p.title}</div>
                      <div className="pc-price">{p.price.toLocaleString()} сом</div>
                      <div className="pc-meta">
                        <span><IconLocation />{p.city}</span>
                        <span>{p.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="products-list">
              {filtered.map((p, i) => {
                const Icon = CAT_ICONS[p.category] || IconMore
                return (
                  <div
                    key={p.id}
                    className="prod-row"
                    style={{ animationDelay: `${i * 0.04}s` }}
                    onClick={() => navigate(`/market/${p.id}`)}
                  >
                    <div className="pr-img"><Icon /></div>
                    <div className="pr-info">
                      <div className="pr-title">{p.title}</div>
                      <div className="pr-meta">
                        <span><IconLocation />{p.city}</span>
                        <span className={`pr-cond ${COND_COLORS[p.condition]}`}>{COND_LABELS[p.condition]}</span>
                        <span>{p.time}</span>
                      </div>
                    </div>
                    <div className="pr-right">
                      <div className="pr-price">{p.price.toLocaleString()} сом</div>
                      <button className={`pr-like ${liked[p.id] ? 'liked' : ''}`} onClick={e => toggleLike(e, p.id)}>
                        <IconHeart />
                      </button>
                    </div>
                    <div className="pr-arrow"><IconChevron /></div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Market