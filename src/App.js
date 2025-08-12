import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';

import UploadPage from './UploadPage.jsx';
import PlateSearchPage from './PlateSearchPage.jsx';
import LoginPage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AddInsurancePage from './AddInsurancePage.jsx';
import InsuranceSearchPage from './InsuranceSearchPage.jsx';
import AddParkingPage from './AddParkingPage.jsx';
import ParkingSearchPage from './ParkingSearchPage.jsx';

import './App.css';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="main-container flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><PlateSearchPage /></ProtectedRoute>} />
            <Route path="/add-insurance" element={<ProtectedRoute><AddInsurancePage /></ProtectedRoute>} />
            <Route path="/search-insurance" element={<ProtectedRoute><InsuranceSearchPage /></ProtectedRoute>} />
            <Route path="/add-parking" element={<ProtectedRoute><AddParkingPage /></ProtectedRoute>} />
            <Route path="/search-parking" element={<ProtectedRoute><ParkingSearchPage /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="bg-white py-4">
          <div className="max-w-3xl mx-auto text-center text-gray-500 text-sm">
            © 2025 ALPR App – versiune 1.0.0
          </div>
        </footer>
      </div>
    </Router>
  );
}

function AppHeader() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <h1 className="header-title">ALPR Dashboard</h1>
        {isLoggedIn && (
          <>
            <nav className="nav-buttons">
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  isActive ? 'nav-btn active' : 'nav-btn'
                }
              >
                Upload
              </NavLink>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  isActive ? 'nav-btn active' : 'nav-btn'
                }
              >
                Caută plăcuță
              </NavLink>

              {(role === 'INSURANCE' || role === 'POLICE') && (
                <NavLink
                  to="/search-insurance"
                  className={({ isActive }) =>
                    isActive ? 'nav-btn active' : 'nav-btn'
                  }
                >
                  Caută asigurare
                </NavLink>
              )}

              {role === 'INSURANCE' && (
                <NavLink
                  to="/add-insurance"
                  className={({ isActive }) =>
                    isActive ? 'nav-btn active' : 'nav-btn'
                  }
                >
                  Adaugă asigurare
                </NavLink>
              )}

              {role === 'PARKING' && (
                <NavLink
                  to="/add-parking"
                  className={({ isActive }) =>
                    isActive ? 'nav-btn active' : 'nav-btn'
                  }
                >
                  Adaugă parcare
                </NavLink>
              )}

              {(role === 'PARKING' || role === 'POLICE') && (
                <NavLink
                  to="/search-parking"
                  className={({ isActive }) =>
                    isActive ? 'nav-btn active' : 'nav-btn'
                  }
                >
                  Caută parcare
                </NavLink>
              )}

              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </nav>

            <div className="text-center text-sm text-gray-500 mt-2">
              Logat ca: <strong>{username}</strong> ({role})
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default App;
