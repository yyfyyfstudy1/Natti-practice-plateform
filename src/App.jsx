import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import QuestionDetail from './components/QuestionDetail/QuestionDetail';
import AdminPortal from './components/Admin/AdminPortal';
import QuestionManager from './components/Admin/QuestionManager';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import GlobalLoading from './components/Loading/GlobalLoading';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <AuthProvider>
      <LoadingProvider>
        <Router>
          <div className="app">
          <Routes>
            {/* Admin portal routes - full screen */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/question/new" element={<QuestionManager />} />
            <Route path="/admin/question/edit/:questionId" element={<QuestionManager />} />
            
            {/* Regular routes with sidebar */}
            <Route path="/*" element={
              <>
                {/* Sidebar navigation */}
                <Sidebar onToggle={handleSidebarToggle} />
                
                {/* Main content area */}
                <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                  <Routes>
                    {/* Home route with header and content list */}
                    <Route path="/" element={
                      <>
                        <Header />
                        <Content />
                      </>
                    } />
                    
                    {/* Question detail route */}
                    <Route path="/question/:questionId" element={<QuestionDetail />} />
                  </Routes>
                </div>
              </>
            } />
            </Routes>
            <GlobalLoading />
          </div>
        </Router>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default App;
