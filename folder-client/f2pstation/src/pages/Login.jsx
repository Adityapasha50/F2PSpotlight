import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleLogin } from '../redux/features/authSlice';
import { Link, useNavigate } from 'react-router';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, isAuthenticated } = useSelector(state => state.auth);
  
  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Inisialisasi Google Sign-In
  useEffect(() => {
    // Pastikan window.google sudah tersedia
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '522885392559-lu757tp7np7e9nu23p86mp4niqpv0251.apps.googleusercontent.com',
        callback: handleGoogleResponse
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { 
          theme: 'filled_blue', 
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  }, []);
  
  const handleGoogleResponse = (response) => {
    if (response.credential) {
      dispatch(googleLogin(response.credential))
        .then((result) => {
          if (!result.error) {
            navigate('/');
          }
        });
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      // Redirect ke halaman utama jika login berhasil
      navigate('/');
    }
  };
  
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" 
         style={{
           background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
           fontFamily: '"Press Start 2P", "Roboto", sans-serif'
         }}>
      <div className="card border-0 shadow-lg" 
           style={{
             maxWidth: '450px', 
             width: '100%', 
             background: 'rgba(26, 27, 38, 0.95)', 
             borderRadius: '15px',
             boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
           }}>
        <div className="card-header text-center border-0 pt-4" 
             style={{ background: 'transparent' }}>
          <h2 className="text-uppercase fw-bold mb-0" 
              style={{ color: '#00ffff', textShadow: '0 0 10px rgba(0, 255, 255, 0.5)' }}>
            Player Login
          </h2>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" 
                     style={{ color: '#00ffff', fontWeight: 'bold' }} 
                     htmlFor="email">
                EMAIL
              </label>
              <input
                className="form-control bg-dark text-light border-0"
                style={{ 
                  height: '50px', 
                  borderBottom: '2px solid #00ffff',
                  boxShadow: 'none'
                }}
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label" 
                     style={{ color: '#00ffff', fontWeight: 'bold' }} 
                     htmlFor="password">
                PASSWORD
              </label>
              <input
                className="form-control bg-dark text-light border-0"
                style={{ 
                  height: '50px', 
                  borderBottom: '2px solid #00ffff',
                  boxShadow: 'none'
                }}
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="d-grid gap-2 mt-5">
              <button
                className="btn btn-lg text-uppercase fw-bold"
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                  color: '#1a1a2e',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '5px',
                  boxShadow: '0 0 15px rgba(0, 255, 255, 0.5)',
                  transition: 'all 0.3s ease'
                }}
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading...
                  </> : 
                  'LOGIN'
                }
              </button>
            </div>
          </form>
          
          {/* Tambahkan div untuk tombol Google Sign-In */}
          <div className="mt-3">
            <div className="text-center mb-2" style={{ color: '#adb5bd' }}>ATAU</div>
            <div id="googleSignInDiv" className="d-flex justify-content-center"></div>
          </div>
          
          <div className="text-center mt-4">
            <p style={{ color: '#adb5bd' }}>
              Don't have an account? 
              <Link to="/register" 
                    style={{ 
                      color: '#00ffff', 
                      textDecoration: 'none',
                      marginLeft: '5px',
                      fontWeight: 'bold',
                      textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                    }}>
                REGISTER HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;