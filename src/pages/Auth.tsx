import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';
import { environment } from '../environment';

const CORRECT_PASSPHRASE = environment.AUTH_PASSPHRASE;

const Auth = () => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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
      navigate('/dashboard', { replace: true });
    } else {
      setError(true);
      setPassphrase('');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img
            src="https://lakesidecentre.org/assets/images/logo.svg?v=b3553521f6"
            alt="Lakeside Study Centre Logo"
            className="logo-image"
          />
        </div>

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