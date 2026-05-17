import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/auth.css';

export function LoginScreen() {
  const [step, setStep] = useState('start'); // 'start' | 'password'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oAuthLoading, setOAuthLoading] = useState(null);
  const { login, signInWithGoogle, signInWithLinkedIn } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setStep('password');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setOAuthLoading('google');
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign in failed');
      setOAuthLoading(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    setError('');
    setOAuthLoading('linkedin');
    try {
      await signInWithLinkedIn();
    } catch (err) {
      setError(err.message || 'LinkedIn sign in failed');
      setOAuthLoading(null);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-lg">
        <div className="auth-header">
          <div className="logo-mark">P</div>
          <h1>PostRoast</h1>
        </div>

        {step === 'start' ? (
          <>
            <h2>Sign in to your account</h2>
            <p className="auth-subtitle">LinkedIn growth, powered by AI</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="auth-oauth-buttons-full">
              <button
                type="button"
                className="auth-oauth-btn-full google"
                onClick={handleGoogleSignIn}
                disabled={oAuthLoading !== null}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="auth-oauth-btn-full linkedin"
                onClick={handleLinkedInSignIn}
                disabled={oAuthLoading !== null}
              >
                <svg className="oauth-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" fill="currentColor"/>
                </svg>
                Continue with LinkedIn
              </button>
            </div>

            <div className="auth-divider">OR</div>

            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="auth-input"
                />
              </div>

              <button type="submit" className="auth-button auth-button-primary" disabled={oAuthLoading}>
                Continue
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account?{' '}
              <a className="auth-link" onClick={() => navigate('/signup')}>Create one</a>
            </p>
          </>
        ) : (
          <>
            <h2>Enter your password</h2>
            <p className="auth-subtitle" style={{ marginBottom: '32px' }}>{email}</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                  autoFocus
                />
              </div>

              <button type="submit" className="auth-button auth-button-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="auth-divider">OR</div>

            <div className="auth-oauth-buttons-full">
              <button
                type="button"
                className="auth-oauth-btn-full-alt"
                onClick={() => setStep('start')}
              >
                ← Use a different email
              </button>
            </div>

            <p className="auth-footer">
              <a className="auth-link" onClick={() => navigate('/signup')}>Don't have an account? Sign up</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
