import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            Farmer's Marketplace
          </Link>

          <div className="nav-links">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="icon" />
                  <span>{user.name} ({user.role})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn"
                  style={{ color: 'var(--text-light)' }}
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="icon" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

