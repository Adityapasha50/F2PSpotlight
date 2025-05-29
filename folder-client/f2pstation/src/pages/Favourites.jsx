import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../redux/features/gamesSlice';
import GameCard from '../components/GameCard';
import { useNavigate } from 'react-router';

function Favourites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, favoritesStatus, error } = useSelector(state => state.games);
  const isAuthenticated = localStorage.getItem('access_token') ? true : false;
  
  useEffect(() => {
    // Redirect ke halaman login jika belum login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch favorites dari server
    dispatch(fetchFavorites());
  }, [dispatch, isAuthenticated, navigate]);
  
  return (
    <div className="min-vh-100" 
         style={{
           background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
           fontFamily: '"Press Start 2P", "Roboto", sans-serif'
         }}>
      <div className="container py-5">
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h1 className="display-4 fw-bold text-uppercase" 
                style={{ 
                  color: '#00ffff', 
                  textShadow: '0 0 15px rgba(0, 255, 255, 0.5)' 
                }}>
              My Favourites
            </h1>
            <p className="lead" style={{ color: '#adb5bd' }}>
              Your collection of favourite free-to-play games
            </p>
          </div>
        </div>
        
        {favoritesStatus === 'loading' && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border" role="status" style={{ color: '#00ffff' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: '#adb5bd' }}>Loading your favourites...</p>
            </div>
          </div>
        )}
        
        {favoritesStatus === 'failed' && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert" role="alert" style={{ background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', borderRadius: '10px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error || 'Failed to load favourites. Please try again later.'}
              </div>
            </div>
          </div>
        )}
        
        {favoritesStatus === 'succeeded' && favorites.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p style={{ color: '#adb5bd' }}>You don't have any favourite games yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="btn mt-3" 
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                  color: '#1a1a2e',
                  fontWeight: 'bold',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                }}
              >
                Browse Games
              </button>
            </div>
          </div>
        )}
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {favorites.map(game => (
            <div className="col" key={game.id}>
              <GameCard game={game} isFavoritePage={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favourites;