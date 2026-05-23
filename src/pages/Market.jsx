import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import '../assets/styles/market.css'

const IconGrid = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconList = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconLocation = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
const IconHeart = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>

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
  const [city, setCity] = useState('Баары')
  const [condition, setCondition] = useState('all')
  const [maxPrice, setMaxPrice] = useState(3000000)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')
  const [liked, setLiked] = useState({})

  const filters = useMemo(() => ({
    search, city, condition, max_price: maxPrice
  }), [search, city, condition, maxPrice])

  const { products, loading } = useProducts(filters)

  const sorted = useMemo(() => {
    if (sortBy === 'price_low') return [...products].sort((a, b) => a.price - b.price)
    if (sortBy === 'price_high') return [...products].sort((a, b) => b.price - a.price)
    return products
  }, [products, sortBy])

  const resetFilters = () => {
    setCity('Баары'); setCondition('all'); setMaxPrice(3000000); setSearch('')
  }

  const toggleLike = (e, id) => {
    e.stopPropagation()
    setLiked(p => ({ ...p, [p.id]: !p[p.id] }))
  }

  const getProductImage = (product) => {
    if (product.product_images?.length > 0) {
      return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0].url
    }
    return null
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const hours = Math.floor(diff / 3600000)
    if (hours < 24) return `${hours} саат мурун`
    return `${Math.floor(hours / 24)} күн мурун`
  }

  const renderGridItem = (p) => {
    const img = getProductImage(p)
    return (
      <div key={p.id} className="prod-card" onClick={() => navigate(`/market/${p.id}`)}>
        <div className="pc-img">
          {img
            ? <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          }
          <span className={`pc-cond ${COND_COLORS[p.condition]}`}>{COND_LABELS[p.condition]}</span>
          <button className={`pc-like ${liked[p.id] ? 'liked' : ''}`} onClick={e => toggleLike(e, p.id)}>
            <IconHeart />
          </button>
        </div>
        <div className="pc-body">
          <div className="pc-title">{p.title}</div>
          <div className="pc-price">{p.price?.toLocaleString()} сом</div>
          <div className="pc-meta">
            <span><IconLocation />{p.location}</span>
            <span>{timeAgo(p.created_at)}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderListItem = (p) => {
    const img = getProductImage(p)
    return (
      <div key={p.id} className="prod-row" onClick={() => navigate(`/market/${p.id}`)}>
        <div className="pr-img">
          {img
            ? <img src={img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
          }
        </div>
        <div className="pr-info">
          <div className="pr-title">{p.title}</div>
          <div className="pr-meta">
            <span><IconLocation />{p.location}</span>
            <span className={`pr-cond ${COND_COLORS[p.condition]}`}>{COND_LABELS[p.condition]}</span>
            <span>{timeAgo(p.created_at)}</span>
          </div>
        </div>
        <div className="pr-right">
          <div className="pr-price">{p.price?.toLocaleString()} сом</div>
          <button className={`pr-like ${liked[p.id] ? 'liked' : ''}`} onClick={e => toggleLike(e, p.id)}>
            <IconHeart />
          </button>
        </div>
        <div className="pr-arrow"><IconChevron /></div>
      </div>
    )
  }

  return (
    <div className="market-page">
      <div className="market-header">
        <div className="market-header-inner">
          <div>
            <h1>Базар</h1>
            <p>{sorted.length} товар табылды</p>
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
        <aside className="market-filter">
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
            <div className="filter-label">Абалы</div>
            {CONDITIONS.map(c => (
              <label key={c.value} className={`filter-option ${condition === c.value ? 'active' : ''}`}>
                <input type="radio" name="cond" checked={condition === c.value} onChange={() => setCondition(c.value)} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>

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

          <div className="filter-cta">
            <p>Товар сатасызбы?</p>
            <button onClick={() => navigate('/post/new?type=product')}>+ Жарнама берүү</button>
          </div>
        </aside>

        <div className="market-main">
          <div className="market-toolbar">
            <span className="market-count">{sorted.length} товар</span>
            <div className="sort-wrap">
              <span>Иреттөө:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Жаңысы</option>
                <option value="price_low">Баа: арзан</option>
                <option value="price_high">Баа: кымбат</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="market-loading">
              {[...Array(6)].map((_, i) => <div key={i} className="product-skeleton" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="market-empty">
              <div className="empty-icon"><IconSearch /></div>
              <div className="empty-title">Товар табылган жок</div>
              <div className="empty-sub">Фильтрлерди өзгөртүп көрүңүз</div>
              <button onClick={resetFilters}>Фильтрлерди тазалоо</button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="products-grid">
              {sorted.map(renderGridItem)}
            </div>
          ) : (
            <div className="products-list">
              {sorted.map(renderListItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Market