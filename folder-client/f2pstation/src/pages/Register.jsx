import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/features/authSlice';
import { Link, useNavigate } from 'react-router';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector(state => state.auth);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (!result.error) {
      navigate('/login');
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
            Create Account
          </h2>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" 
                     style={{ color: '#00ffff', fontWeight: 'bold' }} 
                     htmlFor="username">
                USERNAME
              </label>
              <input
                className="form-control bg-dark text-light border-0"
                style={{ 
                  height: '50px', 
                  borderBottom: '2px solid #00ffff',
                  boxShadow: 'none'
                }}
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            
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
                  'REGISTER'
                }
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p style={{ color: '#adb5bd' }}>
              Already have an account? 
              <Link to="/login" 
                    style={{ 
                      color: '#00ffff', 
                      textDecoration: 'none',
                      marginLeft: '5px',
                      fontWeight: 'bold',
                      textShadow: '0 0 5px rgba(0, 255, 255, 0.3)'
                    }}>
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;