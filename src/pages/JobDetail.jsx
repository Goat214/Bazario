import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useAuthStore from '../store/authStore'
import '../assets/styles/jobdetail.css'

// Icons
const IconLocation = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
const IconMoney = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IconBriefcase = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
const IconArrow = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
const IconShare = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
const IconBookmark = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
const IconUsers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>

// Mock data - keyinroq Supabase dan olinadi
const MOCK_JOBS = [
  { id: 1, title: 'React Developer', company: 'TechBishkek', location: 'Бишкек', salary: '60,000 – 100,000', salary_min: 60000, salary_max: 100000, type: 'full_time', category: 'IT', description: `Биз React.js боюнча тажрыйбалуу иштеткичти издеп жатабыз.\n\nМилдеттер:\n- React, Redux, TypeScript менен веб-тиркемелерди иштеп чыгуу\n- REST API менен интеграция\n- Команда менен биргелешип иштөө\n- Кодду карап чыгуу (code review)\n\nТалаптар:\n- React.js боюнча 2+ жыл тажрыйба\n- TypeScript билими\n- Git колдонуу тажрыйбасы\n- Англис тилин окуй алуу\n\nБиз сунуштайбыз:\n- Атаандаш маяна\n- Ийкемдүү иш графиги\n- Кесиптик өсүш мүмкүнчүлүктөрү`, time: '2 саат мурун', verified: true, applicants: 12, posted: '2024-01-15' },
  { id: 2, title: 'UI/UX Дизайнер', company: 'Creative Studio', location: 'Ош', salary: '50,000 – 80,000', salary_min: 50000, salary_max: 80000, type: 'full_time', category: 'Дизайн', description: 'Figma, Adobe XD менен иштей алган дизайнер издейбиз.', time: '5 саат мурун', verified: true, applicants: 8, posted: '2024-01-14' },
  { id: 3, title: 'Бухгалтер', company: 'Finance KG', location: 'Бишкек', salary: '40,000 – 65,000', salary_min: 40000, salary_max: 65000, type: 'full_time', category: 'Финансы', description: '1C программасын жакшы билген бухгалтер керек.', time: '1 күн мурун', verified: false, applicants: 5, posted: '2024-01-13' },
  { id: 4, title: 'Маркетолог', company: 'Digital KG', location: 'Бишкек', salary: '55,000 – 90,000', salary_min: 55000, salary_max: 90000, type: 'remote', category: 'Маркетинг', description: 'SMM, таргет жарнама боюнча тажрыйбасы бар адис.', time: '1 күн мурун', verified: true, applicants: 15, posted: '2024-01-13' },
]

const TYPE_LABELS = { full_time: 'Толук жумуш', part_time: 'Жарым жумуш', remote: 'Алыстан', contract: 'Келишим' }
const TYPE_COLORS = { full_time: 'green', part_time: 'orange', remote: 'blue', contract: 'purple' }

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [saved, setSaved] = useState(false)
  const [similarJobs, setSimilarJobs] = useState([])

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    // Supabase dan olishga harakat qilamiz
    const { data, error } = await supabase
      .from('jobs')
      .select('*, profiles(full_name, avatar_url)')
      .eq('id', id)
      .single()

    if (data) {
      setJob(data)
      // Similar jobs
      const { data: similar } = await supabase
        .from('jobs')
        .select('*')
        .neq('id', id)
        .eq('status', 'active')
        .limit(3)
      if (similar) setSimilarJobs(similar)
    } else {
      // Mock data
      const mock = MOCK_JOBS.find(j => j.id === +id)
      setJob(mock || null)
      setSimilarJobs(MOCK_JOBS.filter(j => j.id !== +id).slice(0, 3))
    }
    setLoading(false)
  }

  const handleApply = async () => {
    if (!user) { navigate('/auth'); return }
    setApplying(true)
    const { error } = await supabase.from('job_applications').insert({
      job_id: job.id,
      applicant_id: user.id,
      cover_letter: coverLetter,
      status: 'pending'
    })
    if (!error) {
      setApplied(true)
      setShowModal(false)
    }
    setApplying(false)
  }

  if (loading) return (
    <div className="jd-loading">
      <div className="jd-spinner" />
    </div>
  )

  if (!job) return (
    <div className="jd-notfound">
      <h2>Жарнама табылган жок</h2>
      <button onClick={() => navigate('/jobs')}>Иштерге кайтуу</button>
    </div>
  )

  return (
    <div className="jd-page">
      <div className="jd-container">

        {/* Back */}
        <button className="jd-back" onClick={() => navigate('/jobs')}>
          ← Иштерге кайтуу
        </button>

        <div className="jd-layout">

          {/* ── LEFT ── */}
          <div className="jd-left">

            {/* Header card */}
            <div className="jd-header-card">
              <div className="jd-company-logo">{job.company?.[0] || job.title?.[0]}</div>
              <div className="jd-header-info">
                <div className="jd-header-top">
                  <h1 className="jd-title">{job.title}</h1>
                  {job.verified && (
                    <span className="jd-verified"><IconCheck /> Текшерилген</span>
                  )}
                </div>
                <div className="jd-company-name">{job.company || 'Компания'}</div>
                <div className="jd-meta">
                  <span><IconLocation />{job.location}</span>
                  <span><IconMoney />{job.salary} сом</span>
                  <span><IconClock />{job.time || 'Жакында'}</span>
                  <span><IconUsers />{job.applicants || 0} арыз</span>
                </div>
                <div className="jd-tags">
                  <span className={`jd-type ${TYPE_COLORS[job.job_type || job.type]}`}>
                    {TYPE_LABELS[job.job_type || job.type]}
                  </span>
                  {job.category && <span className="jd-cat">{job.category}</span>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="jd-actions">
              {applied ? (
                <div className="jd-applied">
                  <IconCheck /> Арыз берилди!
                </div>
              ) : (
                <button className="jd-apply-btn" onClick={() => user ? setShowModal(true) : navigate('/auth')}>
                  Арыз берүү <IconArrow />
                </button>
              )}
              <button className={`jd-save-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(!saved)}>
                <IconBookmark />
                {saved ? 'Сакталды' : 'Сактоо'}
              </button>
              <button className="jd-share-btn" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <IconShare />
              </button>
            </div>

            {/* Description */}
            <div className="jd-card">
              <h2 className="jd-card-title">Иш сүрөттөмөсү</h2>
              <div className="jd-description">
                {job.description?.split('\n').map((line, i) => (
                  <p key={i}>{line || <br />}</p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="jd-card">
              <h2 className="jd-card-title">Негизги талаптар</h2>
              <ul className="jd-requirements">
                {[
                  'Тиешелүү тажрыйба жана билим',
                  'Команда менен иштей алуу жөндөмү',
                  'Жоопкерчилик жана пунктуалдуулук',
                  'Кесипкөй мамиле',
                ].map((req, i) => (
                  <li key={i}><IconCheck />{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="jd-right">

            {/* Company info */}
            <div className="jd-card">
              <h2 className="jd-card-title">Компания жөнүндө</h2>
              <div className="jd-company-info">
                <div className="jci-logo">{job.company?.[0] || '?'}</div>
                <div className="jci-name">{job.company || 'Компания'}</div>
                {job.verified && (
                  <div className="jci-verified"><IconCheck /> Текшерилген компания</div>
                )}
                <div className="jci-stats">
                  <div className="jci-stat">
                    <span className="jci-stat-val">{job.applicants || 0}</span>
                    <span className="jci-stat-lbl">Арыз</span>
                  </div>
                  <div className="jci-stat">
                    <span className="jci-stat-val">{job.location}</span>
                    <span className="jci-stat-lbl">Жайгашуу</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job info */}
            <div className="jd-card">
              <h2 className="jd-card-title">Иш маалыматы</h2>
              <div className="jd-info-list">
                <div className="jd-info-item">
                  <IconBriefcase />
                  <div>
                    <div className="jii-label">Иш түрү</div>
                    <div className="jii-value">{TYPE_LABELS[job.job_type || job.type] || '—'}</div>
                  </div>
                </div>
                <div className="jd-info-item">
                  <IconLocation />
                  <div>
                    <div className="jii-label">Жайгашуу</div>
                    <div className="jii-value">{job.location}</div>
                  </div>
                </div>
                <div className="jd-info-item">
                  <IconMoney />
                  <div>
                    <div className="jii-label">Маяна</div>
                    <div className="jii-value">{job.salary} сом</div>
                  </div>
                </div>
                <div className="jd-info-item">
                  <IconClock />
                  <div>
                    <div className="jii-label">Жарыяланган</div>
                    <div className="jii-value">{job.time || 'Жакында'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <div className="jd-card">
                <h2 className="jd-card-title">Окшош иштер</h2>
                <div className="similar-jobs">
                  {similarJobs.map(sj => (
                    <div key={sj.id} className="similar-job" onClick={() => navigate(`/jobs/${sj.id}`)}>
                      <div className="sj-logo">{sj.company?.[0] || sj.title?.[0]}</div>
                      <div className="sj-info">
                        <div className="sj-title">{sj.title}</div>
                        <div className="sj-company">{sj.company || 'Компания'}</div>
                        <div className="sj-salary">{sj.salary} сом</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>Арыз берүү</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-job">
              <div className="mj-logo">{job.company?.[0]}</div>
              <div>
                <div className="mj-title">{job.title}</div>
                <div className="mj-company">{job.company}</div>
              </div>
            </div>
            <div className="modal-body">
              <label>Каттама (кошумча)</label>
              <textarea
                placeholder="Өзүңүз жөнүндө кыскача жазыңыз, эмне үчүн бул ишке ылайыктуу экениңизди..."
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
                rows={5}
              />
            </div>
            <div className="modal-foot">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Жокко чыгаруу</button>
              <button className="modal-submit" onClick={handleApply} disabled={applying}>
                {applying ? 'Жөнөтүлүүдө...' : 'Арыз жөнөтүү'} <IconArrow />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetail