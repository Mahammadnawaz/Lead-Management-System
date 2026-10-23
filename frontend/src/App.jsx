import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';

const MainApp = () => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');

  if (isAuthenticated) {
    return (
      <ProtectedRoute onRedirectToLogin={() => setCurrentPage('login')}>
        <DashboardPage />
      </ProtectedRoute>
    );
  }

  if (currentPage === 'register') {
    return <RegisterPage onNavigateToLogin={() => setCurrentPage('login')} />;
  }

  return <LoginPage onNavigateToRegister={() => setCurrentPage('register')} />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
