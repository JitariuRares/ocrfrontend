import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('POLICE'); // default role
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      const decoded = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem('role', decoded.role);
      navigate('/upload');
    } else {
      setError('Autentificare eșuată');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const response = await fetch('http://localhost:8080/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role }),
    });

    if (response.ok) {
      alert('Cont creat cu succes! Te poți loga acum.');
      setIsRegistering(false);
      setUsername('');
      setPassword('');
      setRole('POLICE');
    } else {
      const msg = await response.text();
      setError(msg || 'Înregistrare eșuată');
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="login-header">
          <div className="icon">🔐</div>
          <h2>{isRegistering ? 'Înregistrare cont nou' : 'Autentificare'}</h2>
          <p className="subtitle">
            {isRegistering
              ? 'Completează pentru a-ți crea un cont nou'
              : 'Introdu datele contului tău pentru a continua'}
          </p>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
          <div className="input-group">
            <span className="input-icon">👤</span>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegistering && (
            <div className="input-group">
              <span className="input-icon">🎭</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="POLICE">Poliție</option>
                <option value="INSURANCE">Asigurări</option>
                <option value="PARKING">Parcări</option>
              </select>
            </div>
          )}

          <button type="submit" className="login-button">
            {isRegistering ? 'Înregistrează-te' : 'Login'}
          </button>
        </form>

        {error && (
          <div className="alert alert-error mt-4">
            <strong>Eroare:</strong> {error}
          </div>
        )}

        <p className="subtitle mt-4">
          {isRegistering ? 'Ai deja cont?' : 'Nu ai cont?'}
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            style={{ marginLeft: '0.5rem', textDecoration: 'underline', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
          >
            {isRegistering ? 'Autentifică-te' : 'Creează unul'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
