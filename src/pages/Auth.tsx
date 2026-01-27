import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

// CHANGE THIS PASSPHRASE IN CODE
const CORRECT_PASSPHRASE = 'lakeside2026';

const Auth = () => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated (redirect to dashboard)
  useEffect(() => {
    const authStatus = localStorage.getItem('lakeside_auth');
    if (authStatus === 'authenticated') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passphrase === CORRECT_PASSPHRASE) {
      setError(false);
      // Store authentication in localStorage
      localStorage.setItem('lakeside_auth', 'authenticated');
      // Redirect to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      setError(true);
      setPassphrase('');
    }
  };

  // Login View
  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <svg viewBox="0 0 100 120" className="shield">
            <path d="M50 5 L90 25 L90 60 Q90 90 50 115 Q10 90 10 60 L10 25 Z" fill="#DC2626" stroke="#1e293b" strokeWidth="2"/>
            <pattern id="checkered" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" fill="#3b82f6"/>
              <rect x="5" y="0" width="5" height="5" fill="#1e40af"/>
              <rect x="0" y="5" width="5" height="5" fill="#1e40af"/>
              <rect x="5" y="5" width="5" height="5" fill="#3b82f6"/>
            </pattern>
            <path d="M50 5 L90 25 L90 35 L10 35 L10 25 Z" fill="url(#checkered)"/>
            <path d="M50 45 L65 60 L50 75 L35 60 Z" fill="#FCD34D" stroke="#92400E" strokeWidth="1.5"/>
          </svg>
        </div>

        {/* Brand */}
        <h1 className="auth-title">LAKESIDE</h1>
        <p className="auth-subtitle">Study Centre</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="passphrase">Passphrase</label>
            <input
              id="passphrase"
              type="password"
              value={passphrase}
              onChange={(e) => {
                setPassphrase(e.target.value);
                setError(false);
              }}
              className={error ? 'error' : ''}
              placeholder="Enter passphrase"
              autoFocus
            />
            {error && <span className="error-text">Incorrect passphrase</span>}
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;