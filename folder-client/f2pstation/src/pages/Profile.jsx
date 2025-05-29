import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../redux/features/authSlice';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector(state => state.auth);
  const isAuthenticated = localStorage.getItem('access_token') ? true : false;
  
  const [formData, setFormData] = useState({
    username: '',
    profilePicture: ''
  });
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    dispatch(getProfile());
  }, [dispatch, isAuthenticated, navigate]);
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Username Diperlukan',
        text: 'Silakan masukkan username Anda'
      });
      return;
    }
    
    const result = await dispatch(updateProfile(formData));
    if (!result.error) {
      Swal.fire({
        icon: 'success',
        title: 'Profil Diperbarui!',
        text: 'Profil Anda berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Memuat profil...</p>
      </div>
    );
  }
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card" style={{
            background: 'rgba(26, 27, 38, 0.95)',
            borderRadius: '15px',
            border: '1px solid rgba(0, 255, 255, 0.3)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            color: '#fff'
          }}>
            <div className="card-body p-4">
              <h2 className="text-center mb-4" style={{ color: '#00ffff' }}>Profil Saya</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="text-center mb-4">
                <img 
                  src={formData.profilePicture || 'https://ui-avatars.com/api/?name=' + formData.username} 
                  alt="Profile" 
                  className="rounded-circle img-thumbnail" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      color: '#fff'
                    }}
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="profilePicture" className="form-label">URL Foto Profil</label>
                  <input
                    type="text"
                    className="form-control"
                    id="profilePicture"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(0, 255, 255, 0.3)',
                      color: '#fff'
                    }}
                  />
                  <small className="form-text text-muted">Kosongkan untuk menggunakan avatar default</small>
                </div>
                
                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-lg"
                    disabled={status === 'loading'}
                    style={{
                      background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                      color: '#1a1a2e',
                      fontWeight: 'bold',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px',
                      boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)'
                    }}
                  >
                    {status === 'loading' ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;