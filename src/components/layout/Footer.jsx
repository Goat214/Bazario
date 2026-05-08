import '../../assets/styles/footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">bazar<span>io</span></div>
            <p className="footer-desc">Кыргызстандын иш жана товар платформасы</p>
            <div className="footer-socials">
              {['TG', 'IG', 'FB'].map(s => <a key={s} href="#">{s}</a>)}
            </div>
          </div>
          {[
            { h: 'Платформа', links: [['Иштер', '/jobs'], ['Базар', '/market'], ['Катталуу', '/auth']] },
            { h: 'Жардам', links: [['Байланыш', '#'], ['Эрежелер', '#'], ['Купуялык', '#']] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="footer-h">{col.h}</h4>
              {col.links.map(([l, h]) => <a key={l} href={h} className="footer-link">{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bot">© 2024 Bazario. Бардык укуктар корголгон.</div>
      </div>
    </footer>
  )
}

export default Footer