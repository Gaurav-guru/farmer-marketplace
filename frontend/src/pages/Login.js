import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import homePageBackground from '../images/homepage.jpg';
import { Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedInUser = await login(formData.email, formData.password);

      if (loggedInUser.role === 'FARMER') {
        navigate('/farmer');
      } else if (loggedInUser.role === 'BUYER') {
        navigate('/buyer');
      } else if (loggedInUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <div style={{
      backgroundImage: `url(${homePageBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      position: 'relative',
      top :0,
      left: 0,
      right: 0,
      bottom: 0,
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    }}>

      <div style={{
        backgroundColor: 'rgba(39, 39, 39, 0.6)', // 70% opaque black
        minHeight: '100vh',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        
      }}></div>
    <div className="container" style={{ maxWidth: '400px', marginTop: '2rem', zIndex:'100' }}>
      <div className="card p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(8px)', 
      borderRadius: '12px',
      padding: '2rem',
      width: '300px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white',
}}>
        <h2 className="text-center mb-4">Sign in to your account</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
               }}
            />
          </div>
          <div className="form-group mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
             style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
             }}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
           <Link to="/register">
          <button type="submit" className="btn btn-primary w-100" style={{float:'right'}}>Register</button>
          </Link>
        </form>
      </div>
    </div>
    </div>
  );
}

