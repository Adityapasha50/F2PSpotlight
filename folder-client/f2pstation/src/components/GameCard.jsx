import React from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites } from '../redux/features/gamesSlice';

function GameCard({ game, isFavoritePage = false }) {
  const dispatch = useDispatch();
  const { favorites } = useSelector(state => state.games);
  const isAuthenticated = localStorage.getItem('access_token') ? true : false;
  
  // Cek apakah game ini ada di daftar favorit
  const isFavorite = favorites.some(fav => fav.id === game.id);
  
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Mencegah navigasi jika tombol favorit diklik
    
    if (!isAuthenticated) {
      // Jika belum login, tampilkan pesan untuk login terlebih dahulu
      Swal.fire({
        icon: 'info',
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menambahkan game ke favorit',
      });
      return;
    }
    
    if (isFavorite) {
      dispatch(removeFromFavorites(game.id));
    } else {
      dispatch(addToFavorites(game.id));
    }
  };
  
  return (
    <div className="card border-0 h-100 game-card" 
         style={{
           background: 'rgba(26, 27, 38, 0.95)',
           borderRadius: '15px',
           overflow: 'hidden',
           transition: 'all 0.3s ease',
           boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
         }}>
      <div className="position-relative">
        <img 
          src={game.thumbnail} 
          className="card-img-top" 
          alt={game.title}
          style={{
            height: '180px',
            objectFit: 'cover',
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span className="badge" 
                style={{
                  background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                  color: '#1a1a2e',
                  fontWeight: 'bold',
                  padding: '8px 12px',
                  borderRadius: '20px',
                }}>
            {game.genre}
          </span>
        </div>
        
        {/* Tombol Favorit */}
        <div className="position-absolute top-0 start-0 m-2">
          <button 
            onClick={handleFavoriteClick}
            className="btn btn-sm rounded-circle" 
            style={{
              background: isFavorite ? 'linear-gradient(90deg, #ff6b6b, #ff8e8e)' : 'rgba(26, 27, 38, 0.7)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} style={{ color: '#fff', fontSize: '1.2rem' }}></i>
          </button>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold mb-2" 
            style={{ 
              color: '#00ffff', 
              textShadow: '0 0 5px rgba(0, 255, 255, 0.3)' 
            }}>
          {game.title}
        </h5>
        
        <p className="card-text mb-3" style={{ color: '#adb5bd', fontSize: '0.9rem' }}>
          {game.short_description && game.short_description.length > 100 
            ? `${game.short_description.substring(0, 100)}...` 
            : game.short_description}
        </p>
        
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span style={{ color: '#00ffff', fontWeight: 'bold' }}>
            {game.platform}
          </span>
          <div className="d-flex">
            {isFavoritePage && (
              <button
                onClick={() => dispatch(removeFromFavorites(game.id))}
                className="btn btn-sm me-2"
                style={{
                  background: 'rgba(255, 107, 107, 0.2)',
                  color: '#ff6b6b',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  boxShadow: '0 0 5px rgba(255, 107, 107, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
            <a 
              href={game.game_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm" 
              style={{
                background: 'linear-gradient(90deg, #00ffff, #0099ff)',
                color: '#1a1a2e',
                fontWeight: 'bold',
                border: 'none',
                padding: '5px 15px',
                borderRadius: '5px',
                boxShadow: '0 0 10px rgba(0, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}>
              PLAY NOW
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;