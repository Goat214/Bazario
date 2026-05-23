import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useAuthStore from '../store/authStore'
import '../assets/styles/dashboard.css'

// Icons
const IconGrid = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconBriefcase = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const IconShop = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
const IconUser = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IconSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IconLogout = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IconPlus = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
const IconEye = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IconEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
const IconTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
const IconCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconFileText = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>

const MENU = [
  { id: 'overview', label: 'Жалпы көрүнүш', icon: <IconGrid /> },
  { id: 'jobs', label: 'Иш жарнамалары', icon: <IconBriefcase /> },
  { id: 'products', label: 'Товар жарнамалары', icon: <IconShop /> },
  { id: 'applications', label: 'Аризалар', icon: <IconFileText /> },
  { id: 'profile', label: 'Профиль', icon: <IconUser /> },
  { id: 'settings', label: 'Орнотуулар', icon: <IconSettings /> },
]

function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [active, setActive] = useState('overview')
  const [jobs, setJobs] = useState([])
  const [products, setProducts] = useState([])
  const [applications, setApplications] = useState([])
  const [profile, setProfile] = useState({ full_name: '', phone: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    if (!user) { navigate('/auth'); return }
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    const [jobsRes, productsRes, profileRes, appsRes] = await Promise.all([
      supabase.from('jobs').select('*').eq('employer_id', user.id),
      supabase.from('products').select('*').eq('seller_id', user.id),
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('job_applications').select('*, jobs(title)').eq('applicant_id', user.id),
    ])
    if (jobsRes.data) setJobs(jobsRes.data)
    if (productsRes.data) setProducts(productsRes.data)
    if (profileRes.data) setProfile(profileRes.data)
    if (appsRes.data) setApplications(appsRes.data)
    setLoading(false)
  }

  const deleteJob = async (id) => {
    if (!confirm('Жарнаманы өчүрөсүзбү?')) return
    await supabase.from('jobs').delete().eq('id', id)
    setJobs(prev => prev.filter(j => j.id !== id))
  }

  const deleteProduct = async (id) => {
    if (!confirm('Жарнаманы өчүрөсүзбү?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const saveProfile = async () => {
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      phone: profile.phone,
      city: profile.city,
    }).eq('id', user.id)
    if (!error) { setSaveMsg('Сакталды!'); setTimeout(() => setSaveMsg(''), 2000) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    const newPass = e.target.password.value
    const { error } = await supabase.auth.updateUser({ password: newPass })
    if (!error) { setSaveMsg('Сырсөз өзгөртүлдү!'); setTimeout(() => setSaveMsg(''), 2000) }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const statusLabel = { active: 'Активдүү', closed: 'Жабылган', draft: 'Черновик' }
  const statusColor = { active: 'status-active', closed: 'status-closed', draft: 'status-draft' }
  const appStatus = { pending: 'Каралууда', viewed: 'Каралды', accepted: 'Кабыл алынды', rejected: 'Четке кагылды' }
  const appColor = { pending: 'app-pending', viewed: 'app-viewed', accepted: 'app-accepted', rejected: 'app-rejected' }

  if (!user) return null

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">
            {getInitials(user.user_metadata?.full_name || profile.full_name)}
          </div>
          <div className="dash-user-info">
            <div className="dash-user-name">{profile.full_name || user.user_metadata?.full_name || 'User'}</div>
            <div className="dash-user-email">{user.email}</div>
          </div>
        </div>

        <nav className="dash-nav">
          {MENU.map(m => (
            <button
              key={m.id}
              className={`dash-nav-item ${active === m.id ? 'active' : ''}`}
              onClick={() => setActive(m.id)}
            >
              {m.icon}
              <span>{m.label}</span>
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-bottom">
          <button className="dash-new-btn" onClick={() => navigate('/post/new')}>
            <IconPlus /> Жарнама берүү
          </button>
          <button className="dash-logout" onClick={handleLogout}>
            <IconLogout /> Чыгуу
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">

        {/* ── OVERVIEW ── */}
        {active === 'overview' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Жалпы көрүнүш</h2>
              <p>Каттоодон өткөнгө чейин: {new Date(user.created_at).toLocaleDateString()}</p>
            </div>

            <div className="overview-stats">
              {[
                { label: 'Иш жарнамалары', value: jobs.length, icon: <IconBriefcase />, color: 'blue' },
                { label: 'Товар жарнамалары', value: products.length, icon: <IconShop />, color: 'green' },
                { label: 'Аризалар', value: applications.length, icon: <IconFileText />, color: 'purple' },
                { label: 'Активдүү жарнамалар', value: [...jobs, ...products].filter(i => i.status === 'active').length, icon: <IconCheck />, color: 'orange' },
              ].map((s, i) => (
                <div key={i} className={`ov-stat ov-${s.color}`}>
                  <div className="ov-icon">{s.icon}</div>
                  <div className="ov-value">{s.value}</div>
                  <div className="ov-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent */}
            <div className="overview-recent">
              <div className="recent-col">
                <div className="recent-head">
                  <h3>Акыркы иш жарнамалары</h3>
                  <button onClick={() => setActive('jobs')}>Баары →</button>
                </div>
                {jobs.slice(0, 3).map(job => (
                  <div key={job.id} className="recent-item">
                    <div className="ri-title">{job.title}</div>
                    <span className={`ri-status ${statusColor[job.status]}`}>{statusLabel[job.status]}</span>
                  </div>
                ))}
                {jobs.length === 0 && <div className="empty-msg">Жарнама жок</div>}
              </div>
              <div className="recent-col">
                <div className="recent-head">
                  <h3>Акыркы товарлар</h3>
                  <button onClick={() => setActive('products')}>Баары →</button>
                </div>
                {products.slice(0, 3).map(p => (
                  <div key={p.id} className="recent-item">
                    <div className="ri-title">{p.title}</div>
                    <div className="ri-price">{p.price?.toLocaleString()} сом</div>
                  </div>
                ))}
                {products.length === 0 && <div className="empty-msg">Жарнама жок</div>}
              </div>
            </div>
          </div>
        )}

        {/* ── JOBS ── */}
        {active === 'jobs' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Иш жарнамалары</h2>
              <button className="head-btn" onClick={() => navigate('/post/new?type=job')}>
                <IconPlus /> Жаңы жарнама
              </button>
            </div>
            {jobs.length === 0 ? (
              <div className="dash-empty">
                <IconBriefcase />
                <p>Иш жарнамаларыңыз жок</p>
                <button onClick={() => navigate('/post/new?type=job')}>Жарнама берүү</button>
              </div>
            ) : (
              <div className="dash-table">
                <div className="dt-head">
                  <span>Аталышы</span>
                  <span>Маяна</span>
                  <span>Абалы</span>
                  <span>Дата</span>
                  <span>Иш-аракет</span>
                </div>
                {jobs.map(job => (
                  <div key={job.id} className="dt-row">
                    <div className="dt-title">{job.title}</div>
                    <div className="dt-salary">{job.salary || '—'}</div>
                    <span className={`dt-status ${statusColor[job.status]}`}>{statusLabel[job.status]}</span>
                    <div className="dt-date">{new Date(job.created_at).toLocaleDateString()}</div>
                    <div className="dt-actions">
                      <button className="action-btn view" onClick={() => navigate(`/jobs/${job.id}`)}><IconEye /></button>
                      <button className="action-btn delete" onClick={() => deleteJob(job.id)}><IconTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {active === 'products' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Товар жарнамалары</h2>
              <button className="head-btn" onClick={() => navigate('/post/new?type=product')}>
                <IconPlus /> Жаңы жарнама
              </button>
            </div>
            {products.length === 0 ? (
              <div className="dash-empty">
                <IconShop />
                <p>Товар жарнамаларыңыз жок</p>
                <button onClick={() => navigate('/post/new?type=product')}>Жарнама берүү</button>
              </div>
            ) : (
              <div className="dash-table">
                <div className="dt-head">
                  <span>Аталышы</span>
                  <span>Баасы</span>
                  <span>Абалы</span>
                  <span>Дата</span>
                  <span>Иш-аракет</span>
                </div>
                {products.map(p => (
                  <div key={p.id} className="dt-row">
                    <div className="dt-title">{p.title}</div>
                    <div className="dt-salary">{p.price?.toLocaleString()} сом</div>
                    <span className={`dt-status ${statusColor[p.status]}`}>{statusLabel[p.status]}</span>
                    <div className="dt-date">{new Date(p.created_at).toLocaleDateString()}</div>
                    <div className="dt-actions">
                      <button className="action-btn view" onClick={() => navigate(`/market/${p.id}`)}><IconEye /></button>
                      <button className="action-btn delete" onClick={() => deleteProduct(p.id)}><IconTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {active === 'applications' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Аризалар</h2>
            </div>
            {applications.length === 0 ? (
              <div className="dash-empty">
                <IconFileText />
                <p>Аризаларыңыз жок</p>
                <button onClick={() => navigate('/jobs')}>Иштерди көрүү</button>
              </div>
            ) : (
              <div className="dash-table">
                <div className="dt-head">
                  <span>Иш аталышы</span>
                  <span>Абалы</span>
                  <span>Арыз берилген күн</span>
                </div>
                {applications.map(app => (
                  <div key={app.id} className="dt-row">
                    <div className="dt-title">{app.jobs?.title || '—'}</div>
                    <span className={`dt-status ${appColor[app.status]}`}>{appStatus[app.status]}</span>
                    <div className="dt-date">{new Date(app.applied_at).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ── */}
        {active === 'profile' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Профиль</h2>
            </div>
            <div className="profile-form">
              <div className="profile-avatar-wrap">
                <div className="profile-avatar">
                  {getInitials(profile.full_name || user.user_metadata?.full_name)}
                </div>
                <div>
                  <div className="profile-name">{profile.full_name || '—'}</div>
                  <div className="profile-email">{user.email}</div>
                </div>
              </div>

              <div className="pf-grid">
                <div className="pf-group">
                  <label>Толук аты-жөнү</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                    placeholder="Аты Фамилиясы"
                  />
                </div>
                <div className="pf-group">
                  <label>Телефон</label>
                  <input
                    type="text"
                    value={profile.phone || ''}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+996 XXX XXX XXX"
                  />
                </div>
                <div className="pf-group">
                  <label>Шаар</label>
                  <select value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}>
                    <option value="">Тандаңыз</option>
                    {['Бишкек', 'Ош', 'Жалал-Абад', 'Каракол', 'Токмок', 'Нарын', 'Талас', 'Баткен'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {saveMsg && <div className="save-msg"><IconCheck /> {saveMsg}</div>}

              <button className="save-btn" onClick={saveProfile}>
                Сактоо
              </button>
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {active === 'settings' && (
          <div className="dash-section">
            <div className="dash-section-head">
              <h2>Орнотуулар</h2>
            </div>
            <div className="settings-wrap">
              <div className="settings-card">
                <h3>Сырсөздү өзгөртүү</h3>
                <form onSubmit={changePassword} className="settings-form">
                  <div className="pf-group">
                    <label>Жаңы сырсөз</label>
                    <input type="password" name="password" placeholder="Жаңы сырсөз (мин. 6 символ)" minLength={6} required />
                  </div>
                  {saveMsg && <div className="save-msg"><IconCheck /> {saveMsg}</div>}
                  <button type="submit" className="save-btn">Өзгөртүү</button>
                </form>
              </div>

              <div className="settings-card danger-card">
                <h3>Аккаунт</h3>
                <p>Системадан чыгуу үчүн төмөнкү баскычты басыңыз</p>
                <button className="danger-btn" onClick={handleLogout}>
                  <IconLogout /> Чыгуу
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard