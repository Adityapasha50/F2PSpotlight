import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { useEffect, useState } from 'react';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Gunakan state dari Redux untuk status autentikasi
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigasi ke halaman home dengan query parameter search
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" 
         style={{
           background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
           borderBottom: '2px solid rgba(138, 43, 226, 0.5)',
           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
         }}>
      <div className="container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <div className="me-2" style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #8A2BE2, #4B0082)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(138, 43, 226, 0.6)'
          }}>
            <i className="bi bi-controller" style={{ fontSize: '1.5rem', color: '#fff' }}></i>
          </div>
          <span style={{ 
            background: 'linear-gradient(to right, #00ffff, #8A2BE2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textShadow: '0 0 10px rgba(138, 43, 226, 0.3)'
          }}>
            F2P STATION
          </span>
        </Link>

        {/* Toggler for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent" 
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
          style={{
            border: '1px solid rgba(138, 43, 226, 0.5)',
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/" 
                className="nav-link d-flex align-items-center" 
                style={{
                  color: '#00ffff',
                  fontWeight: 'bold',
                  margin: '0 10px',
                  transition: 'all 0.3s ease',
                  textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.textShadow = '0 0 10px rgba(0, 255, 255, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.textShadow = '0 0 5px rgba(0, 255, 255, 0.3)';
                }}
              >
                <i className="bi bi-house-door-fill me-1"></i>
                HOME
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    to="/favourites" 
                    className="nav-link d-flex align-items-center" 
                    style={{
                      color: '#adb5bd',
                      fontWeight: 'bold',
                      margin: '0 10px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff6b6b';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.textShadow = '0 0 10px rgba(255, 107, 107, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#adb5bd';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.textShadow = 'none';
                    }}
                  >
                    <i className="bi bi-heart-fill me-1"></i>
                    FAVOURITES
                  </Link>
                </li>
                {/* Tombol Topup Primogem dengan ikon dan indikator */}
                <li className="nav-item">
                  <Link 
                    to="/topup" 
                    className="nav-link d-flex align-items-center position-relative" 
                    style={{
                      color: '#FFD700',
                      fontWeight: 'bold',
                      margin: '0 10px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#FFA500';
                      e.target.style.transform = 'translateY(-2px) scale(1.05)';
                      e.target.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#FFD700';
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.textShadow = 'none';
                    }}
                  >
                    <i className="bi bi-gem me-1"></i>
                    TOPUP PRIMOGEM
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                      style={{
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                        fontSize: '0.6rem',
                        padding: '0.25em 0.5em',
                        transform: 'scale(0.9) translateX(-50%)'
                      }}>
                      NEW
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* Search Bar */}
          <form className="d-flex mx-auto my-2 my-lg-0" onSubmit={handleSearch}>
            <div className="input-group">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search games..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  height: '38px',
                  borderTopLeftRadius: '20px',
                  borderBottomLeftRadius: '20px',
                  paddingLeft: '15px',
                  boxShadow: '0 0 10px rgba(138, 43, 226, 0.2)',
                  width: '200px',
                  background: 'rgba(26, 27, 38, 0.8)',
                  border: '1px solid rgba(138, 43, 226, 0.3)',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.width = '250px';
                  e.target.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.4)';
                  e.target.style.border = '1px solid rgba(138, 43, 226, 0.5)';
                }}
                onBlur={(e) => {
                  e.target.style.width = '200px';
                  e.target.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.2)';
                  e.target.style.border = '1px solid rgba(138, 43, 226, 0.3)';
                }}
              />
              <button 
                className="btn px-3" 
                type="submit" 
                style={{
                  background: 'linear-gradient(90deg, #8A2BE2, #4B0082)',
                  color: '#fff',
                  fontWeight: 'bold',
                  borderTopRightRadius: '20px',
                  borderBottomRightRadius: '20px',
                  boxShadow: '0 0 10px rgba(138, 43, 226, 0.3)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #4B0082, #8A2BE2)';
                  e.target.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #8A2BE2, #4B0082)';
                  e.target.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.3)';
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
          </form>

          {/* Login/Register buttons or Profile/Logout */}
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                {/* Ganti indikator primogem dengan profile picture */}
                <div className="me-3 d-none d-md-block">
                  <div 
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #8A2BE2',
                      boxShadow: '0 0 10px rgba(138, 43, 226, 0.5)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.7)';
                      e.currentTarget.style.border = '2px solid #00ffff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.5)';
                      e.currentTarget.style.border = '2px solid #8A2BE2';
                    }}
                    onClick={() => navigate('/profile')}
                  >
                    <img 
                      src={user?.profilePicture || "https://ui-avatars.com/api/?name=User"} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
                <Link 
                  to="/profile" 
                  className="btn me-2 d-flex align-items-center" 
                  style={{
                    background: 'rgba(138, 43, 226, 0.1)',
                    color: '#8A2BE2',
                    border: '1px solid rgba(138, 43, 226, 0.5)',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    boxShadow: '0 0 5px rgba(138, 43, 226, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(138, 43, 226, 0.2)';
                    e.target.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(138, 43, 226, 0.1)';
                    e.target.style.boxShadow = '0 0 5px rgba(138, 43, 226, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-person-fill me-1"></i>
                  PROFIL
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn d-flex align-items-center" 
                  style={{
                    background: 'linear-gradient(90deg, #ff6b6b, #ff0000)',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #ff0000, #ff6b6b)';
                    e.target.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #ff6b6b, #ff0000)';
                    e.target.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="btn me-2 d-flex align-items-center" 
                  style={{
                    background: 'rgba(138, 43, 226, 0.1)',
                    color: '#8A2BE2',
                    border: '1px solid rgba(138, 43, 226, 0.5)',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    boxShadow: '0 0 5px rgba(138, 43, 226, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(138, 43, 226, 0.2)';
                    e.target.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(138, 43, 226, 0.1)';
                    e.target.style.boxShadow = '0 0 5px rgba(138, 43, 226, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  LOGIN
                </Link>
                <Link 
                  to="/register" 
                  className="btn d-flex align-items-center" 
                  style={{
                    background: 'linear-gradient(90deg, #8A2BE2, #4B0082)',
                    color: '#fff',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '5px 15px',
                    boxShadow: '0 0 10px rgba(138, 43, 226, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #4B0082, #8A2BE2)';
                    e.target.style.boxShadow = '0 0 15px rgba(138, 43, 226, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #8A2BE2, #4B0082)';
                    e.target.style.boxShadow = '0 0 10px rgba(138, 43, 226, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="bi bi-person-plus-fill me-1"></i>
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;