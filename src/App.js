import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import StatusPage from './components/StatusPage';
import MyApplicationPage from './components/MyApplicationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            {/* User-facing Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/my-application" element={<MyApplicationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin Route */}
            {/* The login for admins is now handled by the main /login route */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

