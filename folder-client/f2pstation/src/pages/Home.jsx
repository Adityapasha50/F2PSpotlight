import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGames } from '../redux/features/gamesSlice';
import GameCard from '../components/GameCard';
import axios from 'axios';
import { useLocation } from 'react-router';

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { games, status, error, pagination } = useSelector(state => state.games);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGames, setFilteredGames] = useState([]);
  const [filterStatus, setFilterStatus] = useState('idle');
  const [filterPagination, setFilterPagination] = useState(null);
  
  // State untuk game populer
  const [popularGame, setPopularGame] = useState(null);
  const [popularGameLoading, setPopularGameLoading] = useState(false);
  
  // Ambil search term dari query parameter URL
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search') || '';
  
  // Ambil data game saat komponen dimount atau filter berubah
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12
    };
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (selectedGenre) {
      // Gunakan endpoint category jika genre dipilih
      setFilterStatus('loading');
      axios.get(`https://aditpasha.shop/games/category/${selectedGenre}`, { params })
        .then(response => {
          setFilteredGames(response.data.games);
          setFilterPagination(response.data.pagination);
          setFilterStatus('succeeded');
        })
        .catch(error => {
          console.error('Error fetching filtered games:', error);
          setFilterStatus('failed');
        });
    } else {
      // Reset filtered games dan gunakan endpoint umum
      setFilteredGames([]);
      dispatch(fetchGames(params));
    }
  }, [dispatch, currentPage, searchTerm, selectedGenre, location.search]);
  
  // Fungsi untuk mengambil game populer berdasarkan genre
  const getPopularGameByGenre = async (genre) => {
    setPopularGameLoading(true);
    setPopularGame(null);
    
    try {
      const formattedGenre = encodeURIComponent(genre.trim());
      
      // Coba endpoint Gemini terlebih dahulu
      try {
        const response = await axios.get(`https://aditpasha.shop//games/popular/${formattedGenre}`);
        if (response.data && response.data.game) {
          setPopularGame(response.data.game);
          setPopularGameLoading(false);
          return;
        }
      } catch (geminiError) {
        console.error(`Gemini endpoint failed for ${genre}:`, geminiError);
        // Lanjutkan ke endpoint alternatif
      }
      
      // Jika Gemini gagal, gunakan endpoint alternatif
      const fallbackResponse = await axios.get(`https://aditpasha.shop/games/popular-simple/${formattedGenre}`);
      if (fallbackResponse.data && fallbackResponse.data.game) {
        setPopularGame(fallbackResponse.data.game);
      } else {
        throw new Error('Both endpoints failed');
      }
    } catch (error) {
      console.error(`Error fetching popular ${genre} game:`, error);
      // Fallback ke data dummy seperti sebelumnya
      const dummyGame = {
        id: Math.floor(Math.random() * 100) + 1,
        title: `Best ${genre} Game`,
        thumbnail: "https://www.freetogame.com/g/1/thumbnail.jpg",
        short_description: `This is a popular ${genre} game with amazing graphics and gameplay`,
        game_url: "https://www.freetogame.com/open/dauntless",
        genre: genre,
        platform: "PC (Windows)",
        publisher: "Game Studio",
        developer: "Game Developer",
        release_date: "2023-01-01",
        freetogame_profile_url: "https://www.freetogame.com/game"
      };
      setPopularGame(dummyGame);
    } finally {
      setPopularGameLoading(false);
    }
  };
  
  // Dapatkan semua genre unik
  const genres = games.length > 0 
    ? [...new Set(games.map(game => game.genre))].sort() 
    : [];
  
  // Tentukan games dan pagination yang akan ditampilkan
  const displayGames = selectedGenre ? filteredGames : games;
  const displayPagination = selectedGenre ? filterPagination : pagination;
  const displayStatus = selectedGenre ? filterStatus : status;
  
  // 4 genre populer untuk ikon dengan ikon kustom
  const popularGenres = [
    { name: 'Shooter', icon: 'bi-bullseye', color: 'linear-gradient(45deg, #ff5e5e, #ff0000)' },
    { name: 'MMORPG', icon: 'bi-shield-fill', color: 'linear-gradient(45deg, #5e5eff, #0000ff)' },
    { name: 'Strategy', icon: 'bi-trophy-fill', color: 'linear-gradient(45deg, #5eff5e, #00ff00)' },
    { name: 'Racing', icon: 'bi-speedometer2', color: 'linear-gradient(45deg, #ffff5e, #ffff00)' }
  ];
  
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
              F2P Station
            </h1>
            <p className="lead" style={{ color: '#adb5bd' }}>
              Discover the best free-to-play games available now
            </p>
          </div>
        </div>
        
        {/* 4 Ikon Genre dengan Ikon Kustom */}
        <div className="row mb-5">
          <div className="col-12">
            <h4 className="text-center mb-4" style={{ color: '#ff00ff' }}>
              Trending Games by Genre
            </h4>
            <div className="d-flex justify-content-center gap-4 flex-wrap">
              {popularGenres.map(genre => (
                <div 
                  key={genre.name} 
                  className="text-center" 
                  onClick={() => getPopularGameByGenre(genre.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center mb-2"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: genre.color,
                      boxShadow: `0 0 15px ${genre.color.split(',')[1].trim().replace(')', ', 0.5)')}`,
                      margin: '0 auto',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                      e.currentTarget.style.boxShadow = `0 0 25px ${genre.color.split(',')[1].trim().replace(')', ', 0.8)')}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = `0 0 15px ${genre.color.split(',')[1].trim().replace(')', ', 0.5)')}`;
                    }}
                  >
                    <i className={`bi ${genre.icon}`} style={{ fontSize: '2rem', color: '#fff' }}></i>
                  </div>
                  <p style={{ color: '#00ffff', fontSize: '0.8rem', fontWeight: 'bold' }}>{genre.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tampilkan game populer jika ada */}
        {popularGameLoading && (
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="spinner-border" role="status" style={{ color: '#ff00ff' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ color: '#adb5bd', marginTop: '10px' }}>Finding the most popular game...</p>
            </div>
          </div>
        )}
        
        {popularGame && (
          <div className="row mb-5">
            <div className="col-12">
              <div className="card" style={{ 
                background: 'rgba(26, 27, 38, 0.8)', 
                border: '2px solid #ff00ff',
                borderRadius: '15px',
                boxShadow: '0 0 20px rgba(255, 0, 255, 0.3)'
              }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{ 
                  background: 'linear-gradient(90deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2))',
                  border: 'none',
                  borderTopLeftRadius: '13px',
                  borderTopRightRadius: '13px',
                }}>
                  <h5 style={{ color: '#ff00ff', margin: 0 }}>Most Popular {popularGame.genre} Game</h5>
                  <button 
                    className="btn btn-sm" 
                    onClick={() => setPopularGame(null)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <img 
                        src={popularGame.thumbnail} 
                        alt={popularGame.title} 
                        className="img-fluid rounded" 
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h4 style={{ color: '#00ffff' }}>{popularGame.title}</h4>
                      <p style={{ color: '#adb5bd' }}>{popularGame.short_description}</p>
                      <div className="d-flex gap-2 mb-3">
                        <span className="badge" style={{ background: 'rgba(255, 0, 255, 0.2)', color: '#ff00ff' }}>{popularGame.genre}</span>
                        <span className="badge" style={{ background: 'rgba(0, 255, 255, 0.2)', color: '#00ffff' }}>{popularGame.platform}</span>
                      </div>
                      <a 
                        href={popularGame.game_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn"
                        style={{
                          background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
                          color: '#1a1a2e',
                          fontWeight: 'bold',
                          borderRadius: '20px',
                          padding: '8px 20px',
                          boxShadow: '0 0 10px rgba(255, 0, 255, 0.3)'
                        }}
                      >
                        Play Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <button 
                className={`btn btn-sm ${!selectedGenre ? 'active' : ''}`} 
                onClick={() => setSelectedGenre('')}
                style={{
                  background: !selectedGenre ? 'linear-gradient(90deg, #00ffff, #0099ff)' : 'rgba(26, 27, 38, 0.8)',
                  color: !selectedGenre ? '#1a1a2e' : '#00ffff',
                  border: 'none',
                  margin: '5px',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontWeight: 'bold',
                  boxShadow: !selectedGenre ? '0 0 10px rgba(0, 255, 255, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                  transform: !selectedGenre ? 'scale(1.05)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (selectedGenre) {
                    e.target.style.background = 'rgba(26, 27, 38, 0.95)';
                    e.target.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedGenre) {
                    e.target.style.background = 'rgba(26, 27, 38, 0.8)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                All Games
              </button>
              
              {genres.map(genre => (
                <button 
                  key={genre} 
                  className={`btn btn-sm ${selectedGenre === genre ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedGenre(genre);
                    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
                  }}
                  style={{
                    background: selectedGenre === genre ? 'linear-gradient(90deg, #00ffff, #0099ff)' : 'rgba(26, 27, 38, 0.8)',
                    color: selectedGenre === genre ? '#1a1a2e' : '#00ffff',
                    border: 'none',
                    margin: '5px',
                    borderRadius: '20px',
                    padding: '8px 15px',
                    fontWeight: 'bold',
                    boxShadow: selectedGenre === genre ? '0 0 10px rgba(0, 255, 255, 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    transform: selectedGenre === genre ? 'scale(1.05)' : 'scale(1)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedGenre !== genre) {
                      e.target.style.background = 'rgba(26, 27, 38, 0.95)';
                      e.target.style.boxShadow = '0 0 10px rgba(0, 255, 255, 0.2)';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGenre !== genre) {
                      e.target.style.background = 'rgba(26, 27, 38, 0.8)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tampilkan hasil pencarian jika ada */}
        {searchTerm && (
          <div className="row mb-4">
            <div className="col-12 text-center">
              <div className="alert" style={{ background: 'rgba(0, 255, 255, 0.1)', color: '#00ffff', borderRadius: '10px', border: '1px solid rgba(0, 255, 255, 0.3)' }}>
                <i className="bi bi-search me-2"></i>
                Showing results for: <strong>"{searchTerm}"</strong>
                <button 
                  className="btn btn-sm ms-3" 
                  onClick={() => window.location.href = '/'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '2px 10px',
                  }}
                >
                  <i className="bi bi-x"></i> Clear
                </button>
              </div>
            </div>
          </div>
        )}
        
        {displayStatus === 'loading' && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="spinner-border" role="status" style={{ color: '#00ffff' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: '#adb5bd' }}>Loading awesome games...</p>
            </div>
          </div>
        )}
        
        {displayStatus === 'failed' && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="alert" role="alert" style={{ background: 'rgba(255, 0, 0, 0.2)', color: '#ff6b6b', borderRadius: '10px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error || 'Failed to load games. Please try again later.'}
              </div>
            </div>
          </div>
        )}
        
        {displayStatus === 'succeeded' && displayGames.length === 0 && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <p style={{ color: '#adb5bd' }}>No games found matching your criteria.</p>
            </div>
          </div>
        )}
        
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {displayGames.map(game => (
            <div className="col" key={game.id}>
              <GameCard game={game} />
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {displayPagination && displayPagination.totalPages > 1 && (
          <div className="row mt-5">
            <div className="col-12 d-flex justify-content-center">
              <nav aria-label="Game pagination">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      style={{
                        background: 'rgba(26, 27, 38, 0.8)',
                        color: '#00ffff',
                        border: 'none',
                        boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(26, 27, 38, 0.95)';
                        e.target.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(26, 27, 38, 0.8)';
                        e.target.style.boxShadow = '0 0 5px rgba(0, 255, 255, 0.2)';
                      }}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {[...Array(displayPagination.totalPages).keys()].map(page => (
                    <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(page + 1)}
                        style={{
                          background: currentPage === page + 1 ? 'linear-gradient(90deg, #00ffff, #0099ff)' : 'rgba(26, 27, 38, 0.8)',
                          color: currentPage === page + 1 ? '#1a1a2e' : '#00ffff',
                          border: 'none',
                          boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (currentPage !== page + 1) {
                            e.target.style.background = 'rgba(26, 27, 38, 0.95)';
                            e.target.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.3)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (currentPage !== page + 1) {
                            e.target.style.background = 'rgba(26, 27, 38, 0.8)';
                            e.target.style.boxShadow = '0 0 5px rgba(0, 255, 255, 0.2)';
                          }
                        }}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === displayPagination.totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, displayPagination.totalPages))}
                      style={{
                        background: 'rgba(26, 27, 38, 0.8)',
                        color: '#00ffff',
                        border: 'none',
                        boxShadow: '0 0 5px rgba(0, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(26, 27, 38, 0.95)';
                        e.target.style.boxShadow = '0 0 8px rgba(0, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(26, 27, 38, 0.8)';
                        e.target.style.boxShadow = '0 0 5px rgba(0, 255, 255, 0.2)';
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;