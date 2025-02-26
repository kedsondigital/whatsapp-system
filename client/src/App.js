import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import WhatsAppConnect from './pages/WhatsAppConnect';
import ExtractContacts from './pages/ExtractContacts';
import ScheduleMessage from './pages/ScheduleMessage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container py-3">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/whatsapp/connect" 
              element={
                <PrivateRoute>
                  <WhatsAppConnect />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/whatsapp/extract" 
              element={
                <PrivateRoute>
                  <ExtractContacts />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/whatsapp/schedule" 
              element={
                <PrivateRoute>
                  <ScheduleMessage />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
