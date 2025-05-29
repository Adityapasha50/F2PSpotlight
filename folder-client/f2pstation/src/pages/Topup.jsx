import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Inisialisasi Stripe dengan publishable key dari environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Komponen form pembayaran
const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [animation, setAnimation] = useState(false);

  // Efek animasi saat jumlah primogem berubah
  useEffect(() => {
    setAnimation(true);
    const timer = setTimeout(() => setAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    // Simulasi pembayaran berhasil
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    
    if (result.error) {
      setMessage(`Pembayaran gagal: ${result.error.message}`);
    } else {
      setMessage(`Berhasil topup ${amount} Primogem! Payment Method ID: ${result.paymentMethod.id}`);
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="form-label fw-bold d-flex align-items-center">
          <i className="bi bi-gem me-2" style={{ color: '#FFD700' }}></i>
          Jumlah Primogem
        </label>
        
        <div className="primogem-options">
          {[100, 300, 500, 1000].map((value) => (
            <div 
              key={value}
              onClick={() => setAmount(value)}
              className={`primogem-option ${amount === value ? 'active' : ''}`}
              style={{
                cursor: 'pointer',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '10px',
                border: amount === value ? '2px solid #FFD700' : '1px solid rgba(138, 43, 226, 0.3)',
                background: amount === value 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1))' 
                  : 'rgba(255, 255, 255, 0.05)',
                boxShadow: amount === value 
                  ? '0 0 15px rgba(255, 215, 0, 0.3)' 
                  : '0 2px 5px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                transform: animation && amount === value ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                  }}>
                    <i className="bi bi-gem" style={{ fontSize: '1.2rem', color: '#fff' }}></i>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '1.1rem', color: '#FFD700' }}>{value}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Primogem</div>
                  </div>
                </div>
                <div className="fw-bold" style={{ color: amount === value ? '#8A2BE2' : '#6c757d' }}>
                  Rp {value * 150}
                </div>
              </div>
              {amount === value && (
                <div className="mt-2 text-end">
                  <span className="badge" style={{
                    background: 'linear-gradient(135deg, #8A2BE2, #4B0082)',
                    fontSize: '0.7rem',
                  }}>SELECTED</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="form-label fw-bold d-flex align-items-center">
          <i className="bi bi-credit-card me-2" style={{ color: '#8A2BE2' }}></i>
          Detail Kartu Kredit
        </label>
        <div 
          className="p-4 border rounded" 
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1) inset',
            border: '1px solid rgba(138, 43, 226, 0.3)',
          }}
        >
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                fontFamily: '"Segoe UI", Arial, sans-serif',
                color: '#fff',
                '::placeholder': {
                  color: '#aab7c4',
                },
                iconColor: '#8A2BE2',
              },
              invalid: {
                color: '#ff6b6b',
                iconColor: '#ff6b6b',
              },
            },
          }} />
        </div>
        <div className="mt-2 d-flex align-items-center">
          <i className="bi bi-info-circle me-2" style={{ color: '#adb5bd' }}></i>
          <small className="text-muted">Untuk testing, gunakan nomor kartu: 4242 4242 4242 4242</small>
        </div>
      </div>
      
      <div className="d-grid gap-2">
        <button 
          type="submit" 
          className="btn btn-lg position-relative overflow-hidden" 
          disabled={!stripe || loading}
          style={{
            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!loading && stripe) {
              e.target.style.background = 'linear-gradient(90deg, #FFA500, #FFD700)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(90deg, #FFD700, #FFA500)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)';
          }}
        >
          <span className="d-flex align-items-center justify-content-center">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Memproses...
              </>
            ) : (
              <>
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Bayar Rp {amount * 150}
              </>
            )}
          </span>
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transform: 'skewX(-20deg)',
            animation: 'shine 1.5s infinite',
            display: loading || !stripe ? 'none' : 'block',
          }}></div>
        </button>
      </div>
      
      {message && (
        <div className="mt-4 alert" style={{
          backgroundColor: message.includes('gagal') ? 'rgba(255, 107, 107, 0.1)' : 'rgba(0, 255, 0, 0.1)',
          color: message.includes('gagal') ? '#ff6b6b' : '#00ff00',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          border: message.includes('gagal') 
            ? '1px solid rgba(255, 107, 107, 0.3)' 
            : '1px solid rgba(0, 255, 0, 0.3)',
          padding: '15px',
        }}>
          <div className="d-flex align-items-center">
            <i className={`bi ${message.includes('gagal') ? 'bi-x-circle' : 'bi-check-circle'} me-2`} 
               style={{ fontSize: '1.2rem' }}></i>
            {message}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </form>
  );
};

// Halaman utama Topup
function Topup() {
  return (
    <div className="container py-5" style={{
      background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
      minHeight: '100vh',
      borderRadius: '0',
      marginTop: '-16px', // Menghilangkan gap antara navbar dan container
      paddingTop: '32px !important', // Menambah padding atas untuk kompensasi marginTop
    }}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            border: 'none',
            background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
          }}>
            <div className="card-header text-white py-3" style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              borderBottom: 'none',
            }}>
              <div className="d-flex align-items-center">
                <div style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                }}>
                  <i className="bi bi-gem" style={{ fontSize: '1.8rem' }}></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">Topup Primogem</h4>
                  <small>Tingkatkan pengalaman gaming Anda</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4" style={{ color: '#fff' }}>
              <Elements stripe={stripePromise}>
                <CheckoutForm />
              </Elements>
            </div>
            <div className="card-footer bg-transparent text-center py-3" style={{
              borderTop: '1px solid rgba(138, 43, 226, 0.2)',
              color: '#adb5bd',
            }}>
              <small>
                <i className="bi bi-shield-check me-1"></i>
                Pembayaran aman dengan Stripe
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topup;