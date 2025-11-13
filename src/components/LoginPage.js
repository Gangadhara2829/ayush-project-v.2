import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import modiImage from '../modi-placeholder.png'; 

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const { email, password } = formData;
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Send request to the single, unified login endpoint
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token } = res.data;
      localStorage.setItem('token', token);

      // Decode the token to find the user's role
      const decoded = jwtDecode(token);
      
      // Redirect based on the role
      if (decoded.user.role === 'official') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      // Force a reload to ensure the header component updates correctly
      window.location.reload();

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <h2>Portal Login</h2>
          <p style={{marginTop: "-20px", color: "#666"}}>For Startups & Officials</p>
          <form className="auth-form" onSubmit={onSubmit}>
            {error && <p className="form-error">{error}</p>}
            <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
            <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
            <button type="submit" className="auth-btn">Login</button>
            <Link to="/forgot-password" className="auth-link">Forget Password?</Link>
            <p>or</p>
            <Link to="/register" className="auth-switch-link">Register as a Startup</Link>
          </form>
        </div>
        <div className="auth-info-section">
          <img src={modiImage} alt="Shri Narendra Modi" />
          <p className="quote">"India is a treasure trove of herbal plants, it is, in a way our Green Gold".</p>
          <p className="quote-author">Shri Narendra Modi</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

