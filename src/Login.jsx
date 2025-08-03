import React, { useState } from 'react';
import './App.css';

const USERS = {
  Fernando: 'F3rn4nd0',
  Olivia: '0l1v14',
};

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (USERS[username] === password) {
      onLogin(username);
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="page-title">Lugares visitados </h1>

        <div className="login-content">
          <div className="login-image">
            <img src="/logo.png" alt="Imagen lateral" />
          </div>

          <div className="login-card dark">
            <h2>Iniciar Sesión</h2>
            <p>Bienvenido de nuevo. Por favor, ingresa tus credenciales para continuar.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                type="text"
                placeholder="Escribe tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="Escribe tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit">Entrar</button>

              {error && <p className="error">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;