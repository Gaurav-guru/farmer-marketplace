import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import homePageBackground from '../images/homepage.jpg'
import { Link } from 'react-router-dom';
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(formData.name, formData.email, formData.password, formData.role);
  
      // Navigate user to login page after successful registration
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
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
      <div className="card" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)', 
      backdropFilter: 'blur(8px)', 
      borderRadius: '12px',
      padding: '2rem',
      width: '300px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: 'white'}}>
        <h2 className="text-center mb-4">Create your account</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
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
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
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
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
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
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
               }}
            >
              <option style={{color:'black'}} value="" >Select a role</option>
              <option style={{color:'black'}} value="FARMER">Farmer</option>
              <option style={{color:'black'}}value="BUYER">Buyer</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
          <Link to="/login">
                    <button type="submit" className="btn btn-primary w-100" style={{float:'right'}}>Login?</button>
                    </Link>
        </form>
      </div>
      </div>
    </div>
  );
}

