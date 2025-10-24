import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BudgetProvider } from './contexts/BudgetContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/Auth/PrivateRoute';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } />
                <Route path="/budgets" element={
                  <PrivateRoute>
                    <Budgets />
                  </PrivateRoute>
                } />
                <Route path="/expenses" element={
                  <PrivateRoute>
                    <Expenses />
                  </PrivateRoute>
                } />
                <Route path="/reports" element={
                  <PrivateRoute>
                    <Reports />
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } />
                <Route path="/leaderboard" element={
                  <PrivateRoute>
                    <Leaderboard />
                  </PrivateRoute>
                } />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;