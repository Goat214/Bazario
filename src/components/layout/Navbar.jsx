import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${search}`);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            bazar<span>io</span>
          </Link>

          {/* Search */}
          <form className="navbar-search" onSubmit={handleSearch}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Иш же товар издөө..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Links */}
          <div className="navbar-links">
            <Link
              to="/"
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              Башкы бет
            </Link>
            <Link
              to="/jobs"
              className={`nav-link ${isActive("/jobs") ? "active" : ""}`}
            >
              Иштер
            </Link>
            <Link
              to="/market"
              className={`nav-link ${isActive("/market") ? "active" : ""}`}
            >
              Базар
            </Link>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/post/new" className="btn-post">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Жарнама берүү
                </Link>

                <Link to="/messages" className="navbar-icon-btn">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </Link>

                <div className="navbar-avatar-wrap" ref={dropdownRef}>
                  <button
                    className="navbar-avatar"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="avatar-circle">{getInitials(userName)}</div>
                    <span className="avatar-name">
                      {userName.split(" ")[0]}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="navbar-dropdown">
                      <div className="dropdown-header">
                        <div className="avatar-circle large">
                          {getInitials(userName)}
                        </div>
                        <div>
                          <div className="dropdown-name">{userName}</div>
                          <div className="dropdown-email">{user.email}</div>
                        </div>
                      </div>
                      <div className="dropdown-divider" />
                      <Link
                        to="/dashboard"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Профилим
                      </Link>
                      <div className="dropdown-divider" />
                      <button
                        className="dropdown-item danger"
                        onClick={handleLogout}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Чыгуу
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn-ghost">
                  Кирүү
                </Link>
                <Link to="/auth?tab=register" className="btn-primary">
                  Катталуу
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span
              style={{
                transform: mobileOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />
            <span style={{ opacity: mobileOpen ? 0 : 1 }} />
            <span
              style={{
                transform: mobileOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`navbar-mobile-menu ${mobileOpen ? 'open' : ''}`}>
  <div style={{ padding: '4px 0 16px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
    <div style={{ fontSize: '13px', color: '#94a3b8', padding: '0 16px' }}>Меню</div>
  </div>

  <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}>
    <svg width="18" height="18" style={{ marginRight: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    Башкы бет
  </Link>
  <Link to="/jobs" className={`mobile-nav-link ${isActive('/jobs') ? 'active' : ''}`}>
    <svg width="18" height="18" style={{ marginRight: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
    Иштер
  </Link>
  <Link to="/market" className={`mobile-nav-link ${isActive('/market') ? 'active' : ''}`}>
    <svg width="18" height="18" style={{ marginRight: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
    Базар
  </Link>

  <div className="mobile-divider" />

  {user ? (
    <div className="mobile-actions">
      <Link to="/post/new" className="mobile-nav-link" style={{ background: '#2563eb', color: '#fff', justifyContent: 'center' }}>
        <svg width="16" height="16" style={{ marginRight: 8 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Жарнама берүү
      </Link>
      <Link to="/dashboard" className="mobile-nav-link">
        <svg width="18" height="18" style={{ marginRight: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        Dashboard
      </Link>
      <Link to="/profile" className="mobile-nav-link">
        <svg width="18" height="18" style={{ marginRight: 10 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Профилим
      </Link>
      <div className="mobile-divider" />
      <button
        onClick={handleLogout}
        style={{
          display: 'flex', alignItems: 'center',
          padding: '14px 16px', borderRadius: '12px',
          background: '#fef2f2', color: '#ef4444',
          border: 'none', width: '100%', fontSize: '16px',
          fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
          gap: '10px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Чыгуу
      </button>
    </div>
  ) : (
    <div className="mobile-actions">
      <Link to="/auth" className="mobile-nav-link" style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', justifyContent: 'center' }}>
        Кирүү
      </Link>
      <Link to="/auth?tab=register" className="mobile-nav-link" style={{ background: '#2563eb', color: '#fff', justifyContent: 'center' }}>
        Катталуу
      </Link>
    </div>
  )}
</div>
      {/* Overlay */}
      <div
        className={`navbar-mobile-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
    </>
  );
}

export default Navbar;
