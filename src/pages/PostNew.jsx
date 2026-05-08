import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useAuthStore from '../store/authStore'
import '../assets/styles/postnew.css'

const JOB_CATEGORIES = ['IT & Технология', 'Дизайн', 'Финансы', 'Маркетинг', 'Соода', 'Логистика', 'Билим берүү', 'HR', 'Тамак-аш', 'Медицина', 'Башка']
const PRODUCT_CATEGORIES = ['Телефондор', 'Компьютерлер', 'Унаалар', 'Үй буюмдары', 'Кийим-кече', 'Спорт', 'Балдар үчүн', 'Башка']
const CITIES = ['Бишкек', 'Ош', 'Жалал-Абад', 'Каракол', 'Токмок', 'Нарын', 'Талас', 'Баткен']
const JOB_TYPES = [
  { value: 'full_time', label: 'Толук жумуш' },
  { value: 'part_time', label: 'Жарым жумуш' },
  { value: 'remote', label: 'Алыстан' },
  { value: 'contract', label: 'Келишим' },
]
const CONDITIONS = [
  { value: 'new', label: '🌟 Жаңы' },
  { value: 'like_new', label: '✨ Жаңы сыяктуу' },
  { value: 'good', label: '👍 Жакшы' },
  { value: 'fair', label: '👌 Орточо' },
]

function PostNew() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [tab, setTab] = useState('job')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  // Job form
  const [jobForm, setJobForm] = useState({
    title: '', company: '', category: '', city: '',
    job_type: 'full_time', salary_min: '', salary_max: '', description: ''
  })

  // Product form
  const [productForm, setProductForm] = useState({
    title: '', category: '', city: '',
    price: '', condition: 'good', description: ''
  })

  const updateJob = (field, value) => setJobForm(p => ({ ...p, [field]: value }))
  const updateProduct = (field, value) => setProductForm(p => ({ ...p, [field]: value }))

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5)
    setImages(files)
    setImagePreviews(files.map(f => URL.createObjectURL(f)))
  }

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i))
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/auth'); return }
    setLoading(true)
    setError('')
    console.log('User ID:', user?.id)

    try {
      if (tab === 'job') {
        const { error } = await supabase.from('jobs').insert({
          employer_id: user.id,
          title: jobForm.title,
          description: jobForm.description,
          location: jobForm.city,
          job_type: jobForm.job_type,
          salary: `${jobForm.salary_min} - ${jobForm.salary_max} сом`,
          status: 'active'
        })
        if (error) throw error
      } else {
        const { data: product, error: prodError } = await supabase.from('products').insert({
          seller_id: user.id,
          title: productForm.title,
          description: productForm.description,
          price: +productForm.price,
          condition: productForm.condition,
          location: productForm.city,
          status: 'active'
        }).select().single()
        if (prodError) throw prodError

        // Upload images
        for (let i = 0; i < images.length; i++) {
          const file = images[i]
          const fileName = `${user.id}/${product.id}/${Date.now()}_${i}`
          const { data: uploadData } = await supabase.storage
            .from('product-images')
            .upload(fileName, file)
          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(fileName)
            await supabase.from('product_images').insert({
              product_id: product.id,
              url: publicUrl,
              sort_order: i
            })
          }
        }
      }

      setSuccess(true)
      setTimeout(() => navigate(tab === 'job' ? '/jobs' : '/market'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="postnew-success">
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <h2>Жарнама жайгаштырылды!</h2>
          <p>Сизди тиешелүү бетке багыттап жатабыз...</p>
          <div className="success-loader" />
        </div>
      </div>
    )
  }

  return (
    <div className="postnew-page">
      <div className="postnew-container">

        {/* Header */}
        <div className="postnew-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Артка
          </button>
          <div>
            <h1>Жарнама берүү</h1>
            <p>Иш же товар жарнамаңызды жайгаштырыңыз</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="postnew-tabs">
          <button
            className={`postnew-tab ${tab === 'job' ? 'active' : ''}`}
            onClick={() => setTab('job')}
          >
            <span>💼</span> Иш жарнамасы
          </button>
          <button
            className={`postnew-tab ${tab === 'product' ? 'active' : ''}`}
            onClick={() => setTab('product')}
          >
            <span>🛍️</span> Товар жарнамасы
          </button>
        </div>

        <div className="postnew-layout">
          <form className="postnew-form" onSubmit={handleSubmit}>

            {error && <div className="form-error">⚠️ {error}</div>}

            {/* ── JOB FORM ── */}
            {tab === 'job' && (
              <>
                <div className="form-section">
                  <h3 className="form-section-title">Негизги маалымат</h3>

                  <div className="form-group">
                    <label>Иш аталышы <span>*</span></label>
                    <input
                      type="text"
                      placeholder="Мис: React Developer, Бухгалтер..."
                      value={jobForm.title}
                      onChange={e => updateJob('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Компания аты <span>*</span></label>
                    <input
                      type="text"
                      placeholder="Компанияңыздын аты"
                      value={jobForm.company}
                      onChange={e => updateJob('company', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Категория <span>*</span></label>
                      <select value={jobForm.category} onChange={e => updateJob('category', e.target.value)} required>
                        <option value="">Тандаңыз</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Шаар <span>*</span></label>
                      <select value={jobForm.city} onChange={e => updateJob('city', e.target.value)} required>
                        <option value="">Тандаңыз</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Иш шарттары</h3>

                  <div className="form-group">
                    <label>Иш түрү</label>
                    <div className="radio-group">
                      {JOB_TYPES.map(t => (
                        <label key={t.value} className={`radio-card ${jobForm.job_type === t.value ? 'active' : ''}`}>
                          <input
                            type="radio"
                            name="job_type"
                            value={t.value}
                            checked={jobForm.job_type === t.value}
                            onChange={() => updateJob('job_type', t.value)}
                          />
                          {t.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Минималдуу маяна (сом)</label>
                      <input
                        type="number"
                        placeholder="Мис: 30000"
                        value={jobForm.salary_min}
                        onChange={e => updateJob('salary_min', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Максималдуу маяна (сом)</label>
                      <input
                        type="number"
                        placeholder="Мис: 80000"
                        value={jobForm.salary_max}
                        onChange={e => updateJob('salary_max', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Иш сүрөттөмөсү</h3>
                  <div className="form-group">
                    <label>Толук сүрөттөмө <span>*</span></label>
                    <textarea
                      placeholder="Иш жөнүндө толук маалымат жазыңыз: талаптар, милдеттер, шарттар..."
                      value={jobForm.description}
                      onChange={e => updateJob('description', e.target.value)}
                      rows={6}
                      required
                    />
                    <span className="char-count">{jobForm.description.length} символ</span>
                  </div>
                </div>
              </>
            )}

            {/* ── PRODUCT FORM ── */}
            {tab === 'product' && (
              <>
                <div className="form-section">
                  <h3 className="form-section-title">Товар маалыматы</h3>

                  <div className="form-group">
                    <label>Товар аты <span>*</span></label>
                    <input
                      type="text"
                      placeholder="Мис: iPhone 14 Pro, Samsung TV..."
                      value={productForm.title}
                      onChange={e => updateProduct('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Категория <span>*</span></label>
                      <select value={productForm.category} onChange={e => updateProduct('category', e.target.value)} required>
                        <option value="">Тандаңыз</option>
                        {PRODUCT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Шаар <span>*</span></label>
                      <select value={productForm.city} onChange={e => updateProduct('city', e.target.value)} required>
                        <option value="">Тандаңыз</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Баасы (сом) <span>*</span></label>
                      <input
                        type="number"
                        placeholder="Мис: 25000"
                        value={productForm.price}
                        onChange={e => updateProduct('price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Абалы</label>
                      <select value={productForm.condition} onChange={e => updateProduct('condition', e.target.value)}>
                        {CONDITIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="form-section">
                  <h3 className="form-section-title">Сүрөттөр</h3>
                  <div className="form-group">
                    <label>Сүрөт жүктөө (макс. 5 сүрөт)</label>
                    <div className="image-upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImages}
                        id="img-upload"
                        style={{ display: 'none' }}
                      />
                      {imagePreviews.length < 5 && (
                        <label htmlFor="img-upload" className="upload-btn">
                          <span>📷</span>
                          <span>Сүрөт тандоо</span>
                          <span className="upload-hint">JPG, PNG — макс 5MB</span>
                        </label>
                      )}
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="image-preview">
                          <img src={src} alt="" />
                          <button type="button" className="remove-img" onClick={() => removeImage(i)}>✕</button>
                          {i === 0 && <span className="main-badge">Негизги</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Сүрөттөмө</h3>
                  <div className="form-group">
                    <label>Товар жөнүндө <span>*</span></label>
                    <textarea
                      placeholder="Товардын абалы, өзгөчөлүктөрү, кошумча маалымат..."
                      value={productForm.description}
                      onChange={e => updateProduct('description', e.target.value)}
                      rows={5}
                      required
                    />
                    <span className="char-count">{productForm.description.length} символ</span>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <><span className="btn-spinner" /> Жайгаштырылууда...</>
              ) : (
                <>{tab === 'job' ? '💼 Иш жарнамасын жайгаштыруу' : '🛍️ Товар жарнамасын жайгаштыруу'}</>
              )}
            </button>
          </form>

          {/* Sidebar tips */}
          <div className="postnew-tips">
            <div className="tips-card">
              <h4>💡 Кеңештер</h4>
              {tab === 'job' ? (
                <ul>
                  <li>Иштин аталышын так жазыңыз</li>
                  <li>Маяна диапазонун көрсөтсөңүз, көбүрөөк арыздар келет</li>
                  <li>Талаптарды так жазыңыз</li>
                  <li>Байланыш маалыматыңызды толтуруңуз</li>
                </ul>
              ) : (
                <ul>
                  <li>Сапаттуу сүрөттөр жүктөңүз</li>
                  <li>Товардын абалын чынчыл жазыңыз</li>
                  <li>Баасын базар баасына жакын коюңуз</li>
                  <li>Байланыш маалыматыңызды толтуруңуз</li>
                </ul>
              )}
            </div>

            <div className="tips-card safety">
              <h4>🔒 Коопсуздук</h4>
              <p>Алдын ала акча которууну сурабаңыз. Товарды көрүп алганда гана акча бериңиз.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostNew