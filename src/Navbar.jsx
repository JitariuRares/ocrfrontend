// src/Navbar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './App.css';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <div className="nav-container">
        <div className="nav-card">
          <h1 className="nav-header">ALPR Dashboard</h1>
          {isLoggedIn && (
            <>
              <nav className="nav-links">
                <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Upload
                </NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  Caută plăcuță
                </NavLink>
                {(role === 'INSURANCE' || role === 'POLICE') && (
                  <NavLink to="/search-insurance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Caută asigurare
                  </NavLink>
                )}
                {role === 'INSURANCE' && (
                  <NavLink to="/add-insurance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Adaugă asigurare
                  </NavLink>
                )}
                {role === 'PARKING' && (
                  <NavLink to="/add-parking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Adaugă parcare
                  </NavLink>
                )}
                {(role === 'PARKING' || role === 'POLICE') && (
                  <NavLink to="/search-parking" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    Caută parcare
                  </NavLink>
                )}
                <button onClick={handleLogout} className="nav-link">
                  Logout
                </button>
              </nav>

              <div className="nav-user">
                Logat ca: <strong>{username}</strong> ({role})
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
