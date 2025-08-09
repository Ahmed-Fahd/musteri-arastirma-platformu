import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import CustomerForm from './components/CustomerForm';
import RecordsList from './components/RecordsList';
import Dashboard from './components/Dashboard';
import CustomerDetail from './components/CustomerDetail';
import DatabaseStatus from './components/DatabaseStatus';
import DevelopmentVision from './components/DevelopmentVision';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-customer" element={<CustomerForm />} />
              <Route path="/records" element={<RecordsList />} />
              <Route path="/customer/:id" element={<CustomerDetail />} />
              <Route path="/development-vision" element={<DevelopmentVision />} />
            </Routes>
            <DatabaseStatus />
          </div>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;