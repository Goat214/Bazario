import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useAuthStore from '../store/authStore'
import '../assets/styles/productdetail.css'

const IconLocation = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18z"/></svg>
const IconMessage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IconHeart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
const IconShare = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const IconChevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
const IconUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const IconEye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>

const COND_LABELS = { new: 'Жаңы', like_new: 'Жаңы сыяктуу', good: 'Жакшы', fair: 'Орточо' }
const COND_COLORS = { new: 'cond-new', like_new: 'cond-likenew', good: 'cond-good', fair: 'cond-fair' }

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [product, setProduct] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchProduct()
    window.scrollTo(0, 0)
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(url, sort_order), profiles(full_name, avatar_url, phone, city, created_at)')
      .eq('id', id)
      .single()

    if (data) {
      setProduct(data)
      const { data: sim } = await supabase
        .from('products')
        .select('*, product_images(url, sort_order)')
        .neq('id', id)
        .eq('status', 'active')
        .limit(4)
      if (sim) setSimilar(sim)
    }
    setLoading(false)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getImages = () => {
    if (!product?.product_images?.length) return []
    return [...product.product_images].sort((a, b) => a.sort_order - b.sort_order)
  }

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const hours = Math.floor(diff / 3600000)
    if (hours < 1) return 'Жаңы эле'
    if (hours < 24) return `${hours} саат мурун`
    return `${Math.floor(hours / 24)} күн мурун`
  }

  const memberSince = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
  }

  if (loading) return (
    <div className="pd-loading">
      <div className="pd-spinner" />
    </div>
  )

  if (!product) return (
    <div className="pd-notfound">
      <h2>Товар табылган жок</h2>
      <button onClick={() => navigate('/market')}>Базарга кайтуу</button>
    </div>
  )

  const images = getImages()
  const isOwner = user?.id === product.seller_id

  return (
    <div className="pd-page">
      <div className="pd-container">

        {/* Back */}
        <button className="pd-back" onClick={() => navigate('/market')}>
          ← Базарга кайтуу
        </button>

        <div className="pd-layout">

          {/* ── LEFT ── */}
          <div className="pd-left">

            {/* Images */}
            <div className="pd-images">
              <div className="pd-main-img">
                {images.length > 0 ? (
                  <img src={images[activeImg]?.url} alt={product.title} />
                ) : (
                  <div className="pd-no-img">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                    </svg>
                    <p>Сүрөт жок</p>
                  </div>
                )}
                <span className={`pd-cond ${COND_COLORS[product.condition]}`}>
                  {COND_LABELS[product.condition]}
                </span>
                <button className={`pd-like-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
                  <IconHeart />
                </button>
              </div>

              {images.length > 1 && (
                <div className="pd-thumbnails">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={img.url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="pd-card">
              <h2 className="pd-card-title">Сүрөттөмө</h2>
              <div className="pd-description">
                {product.description
                  ? product.description.split('\n').map((line, i) => <p key={i}>{line || <br />}</p>)
                  : <p className="pd-no-desc">Сүрөттөмө жок</p>
                }
              </div>
            </div>

            {/* Similar */}
            {similar.length > 0 && (
              <div className="pd-card">
                <h2 className="pd-card-title">Окшош товарлар</h2>
                <div className="pd-similar-grid">
                  {similar.map(p => {
                    const img = p.product_images?.length > 0
                      ? [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0].url
                      : null
                    return (
                      <div key={p.id} className="pd-similar-card" onClick={() => navigate(`/market/${p.id}`)}>
                        <div className="psc-img">
                          {img
                            ? <img src={img} alt={p.title} />
                            : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/></svg>
                          }
                        </div>
                        <div className="psc-title">{p.title}</div>
                        <div className="psc-price">{p.price?.toLocaleString()} сом</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div className="pd-right">

            {/* Main info */}
            <div className="pd-card pd-main-info">
              <div className="pd-price">{product.price?.toLocaleString()} сом</div>
              <h1 className="pd-title">{product.title}</h1>

              <div className="pd-meta">
                <span><IconLocation />{product.location}</span>
                <span><IconCalendar />{timeAgo(product.created_at)}</span>
              </div>

              <div className="pd-actions">
                {isOwner ? (
                  <button className="pd-owner-btn" onClick={() => navigate('/dashboard')}>
                    Жарнамани башкаруу
                  </button>
                ) : (
                  <>
                    {product.profiles?.phone && (
                      <a href={`tel:${product.profiles.phone}`} className="pd-call-btn">
                        <IconPhone /> Чалуу
                      </a>
                    )}
                    <button className="pd-msg-btn" onClick={() => user ? navigate('/messages') : navigate('/auth')}>
                      <IconMessage /> Жазуу
                    </button>
                  </>
                )}
              </div>

              <div className="pd-share-row">
                <button className={`pd-share ${copied ? 'copied' : ''}`} onClick={handleShare}>
                  <IconShare /> {copied ? 'Шилтеме көчүрүлдү!' : 'Бөлүшүү'}
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="pd-card">
              <h2 className="pd-card-title">Товар маалыматы</h2>
              <div className="pd-details">
                <div className="pd-detail-row">
                  <span className="pdr-label">Абалы</span>
                  <span className={`pdr-val pd-cond-inline ${COND_COLORS[product.condition]}`}>
                    {COND_LABELS[product.condition]}
                  </span>
                </div>
                <div className="pd-detail-row">
                  <span className="pdr-label">Жайгашуу</span>
                  <span className="pdr-val">{product.location}</span>
                </div>
                <div className="pd-detail-row">
                  <span className="pdr-label">Жарыяланган</span>
                  <span className="pdr-val">{timeAgo(product.created_at)}</span>
                </div>
                <div className="pd-detail-row">
                  <span className="pdr-label">Категория</span>
                  <span className="pdr-val">{product.category_name || '—'}</span>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div className="pd-card">
              <h2 className="pd-card-title">Сатуучу жөнүндө</h2>
              <div className="pd-seller">
                <div className="ps-avatar">
                  {product.profiles?.avatar_url
                    ? <img src={product.profiles.avatar_url} alt="" />
                    : <span>{product.profiles?.full_name?.[0] || '?'}</span>
                  }
                </div>
                <div className="ps-info">
                  <div className="ps-name">{product.profiles?.full_name || 'Колдонуучу'}</div>
                  {product.profiles?.created_at && (
                    <div className="ps-since">
                      <IconCalendar /> {memberSince(product.profiles.created_at)} дан бери
                    </div>
                  )}
                  {product.profiles?.city && (
                    <div className="ps-city"><IconLocation /> {product.profiles.city}</div>
                  )}
                </div>
              </div>
              {!isOwner && (
                <button
                  className="ps-view-btn"
                  onClick={() => navigate(`/profile/${product.seller_id}`)}
                >
                  <IconUser /> Профилди көрүү <IconChevron />
                </button>
              )}
            </div>

            {/* Safety */}
            <div className="pd-card pd-safety">
              <h3>🔒 Коопсуздук кеңештери</h3>
              <ul>
                <li>Товарды жеке жолугушуп алыңыз</li>
                <li>Алдын ала акча которбоңуз</li>
                <li>Товарды текшерип алгандан кийин гана акча бериңиз</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail