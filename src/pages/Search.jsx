import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../assets/styles/search.css'

const IconSearch = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const IconBriefcase = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const IconShop = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const IconLocation = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconClock = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>

const POPULAR = ['Developer', 'Дизайнер', 'iPhone', 'MacBook', 'Бухгалтер', 'Toyota', 'Маркетолог', 'Samsung']

function Search() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [tab, setTab] = useState('all')
  const [jobs, setJobs] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); fetchResults(q) }
  }, [searchParams])

  const fetchResults = async (q) => {
    if (!q.trim()) return
    setLoading(true)
    const [jobsRes, productsRes] = await Promise.all([
      supabase.from('jobs').select('*').ilike('title', `%${q}%`).eq('status', 'active').limit(20),
      supabase.from('products').select('*, product_images(url, sort_order)').ilike('title', `%${q}%`).eq('status', 'active').limit(20),
    ])
    setJobs(jobsRes.data || [])
    setProducts(productsRes.data || [])
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) setSearchParams({ q: query })
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Жаңы эле'
    if (hours < 24) return `${hours} саат мурун`
    return `${Math.floor(hours / 24)} күн мурун`
  }

  const getImg = (product) => {
    if (!product.product_images?.length) return null
    return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)[0].url
  }

  const q = searchParams.get('q')
  const totalResults = jobs.length + products.length
  const showJobs = tab === 'all' || tab === 'jobs'
  const showProducts = tab === 'all' || tab === 'products'

  return (
    <div className="search-page">
      <div className="search-container">

        {/* Search bar */}
        <div className="search-hero">
          <form className="search-bar" onSubmit={handleSearch}>
            <IconSearch />
            <input
              type="text"
              placeholder="Иш же товар издөө..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && <button type="button" className="s-clear" onClick={() => setQuery('')}>✕</button>}
            <button type="submit" className="s-btn">Издөө</button>
          </form>

          {!q && (
            <div className="search-popular">
              <span>Популярдуу:</span>
              {POPULAR.map(t => (
                <button key={t} onClick={() => setSearchParams({ q: t })}>{t}</button>
              ))}
            </div>
          )}
        </div>

        {/* Results */}
        {q && (
          <>
            {/* Header */}
            <div className="search-header">
              <div className="search-info">
                {loading ? (
                  <span className="search-loading-text">Издөөдө...</span>
                ) : (
                  <span><strong>"{q}"</strong> боюнча {totalResults} натыйжа табылды</span>
                )}
              </div>
              <div className="search-tabs">
                <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
                  Баары ({totalResults})
                </button>
                <button className={tab === 'jobs' ? 'active' : ''} onClick={() => setTab('jobs')}>
                  <IconBriefcase /> Иштер ({jobs.length})
                </button>
                <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>
                  <IconShop /> Товарлар ({products.length})
                </button>
              </div>
            </div>

            {loading ? (
              <div className="search-skeletons">
                {[...Array(6)].map((_, i) => <div key={i} className="search-skeleton" />)}
              </div>
            ) : totalResults === 0 ? (
              <div className="search-empty">
                <div className="se-icon"><IconSearch /></div>
                <h3>"{q}" боюнча эч нерсе табылган жок</h3>
                <p>Башка сөздөр менен издеп көрүңүз</p>
                <div className="se-suggestions">
                  {POPULAR.map(t => (
                    <button key={t} onClick={() => setSearchParams({ q: t })}>{t}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="search-results">

                {/* Jobs */}
                {showJobs && jobs.length > 0 && (
                  <div className="results-section">
                    <div className="rs-head">
                      <h3><IconBriefcase /> Иш орундары ({jobs.length})</h3>
                      {tab === 'all' && jobs.length > 3 && (
                        <button onClick={() => setTab('jobs')}>Баарын көрүү →</button>
                      )}
                    </div>
                    <div className="jobs-results">
                      {(tab === 'all' ? jobs.slice(0, 3) : jobs).map((job, i) => (
                        <div key={job.id} className="job-result" onClick={() => navigate(`/jobs/${job.id}`)}>
                          <div className="jr-logo">{job.title?.[0]}</div>
                          <div className="jr-info">
                            <div className="jr-title">{job.title}</div>
                            <div className="jr-meta">
                              <span><IconLocation />{job.location}</span>
                              <span><IconClock />{timeAgo(job.created_at)}</span>
                            </div>
                          </div>
                          <div className="jr-right">
                            <div className="jr-salary">{job.salary || `${job.salary_min?.toLocaleString()} сом`}</div>
                            <span className="jr-type">{
                              job.job_type === 'full_time' ? 'Толук' :
                              job.job_type === 'remote' ? 'Алыстан' :
                              job.job_type === 'part_time' ? 'Жарым' : 'Келишим'
                            }</span>
                          </div>
                          <IconChevron />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products */}
                {showProducts && products.length > 0 && (
                  <div className="results-section">
                    <div className="rs-head">
                      <h3><IconShop /> Товарлар ({products.length})</h3>
                      {tab === 'all' && products.length > 4 && (
                        <button onClick={() => setTab('products')}>Баарын көрүү →</button>
                      )}
                    </div>
                    <div className="products-results">
                      {(tab === 'all' ? products.slice(0, 4) : products).map(p => {
                        const img = getImg(p)
                        return (
                          <div key={p.id} className="product-result" onClick={() => navigate(`/market/${p.id}`)}>
                            <div className="pr-img">
                              {img
                                ? <img src={img} alt={p.title} />
                                : <IconShop />
                              }
                            </div>
                            <div className="pr-info">
                              <div className="pr-title">{p.title}</div>
                              <div className="pr-meta">
                                <span><IconLocation />{p.location}</span>
                                <span><IconClock />{timeAgo(p.created_at)}</span>
                              </div>
                            </div>
                            <div className="pr-price">{p.price?.toLocaleString()} сом</div>
                            <IconChevron />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Empty state — no query */}
        {!q && (
          <div className="search-start">
            <div className="ss-icon"><IconSearch /></div>
            <h3>Эмнени издеп жатасыз?</h3>
            <p>Иш же товар аталышын жазыңыз</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search