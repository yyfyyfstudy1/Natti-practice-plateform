import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import Content from './components/Content/Content';
import './App.css';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="app">
      {/* Sidebar navigation */}
      <Sidebar onToggle={handleSidebarToggle} />
      
      {/* Main content area */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Header with search and filters */}
        <Header />
        
        {/* Content list */}
        <Content />
      </div>
    </div>
  );
}

export default App;
