import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SearchPatients from './components/SearchPatients';
import BookAppointment from './components/BookAppointment';
import './styles.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [navCollapsed, setNavCollapsed] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const toggleNav = () => {
    setNavCollapsed(!navCollapsed);
  };

  return (
    <div className="container">
      <Navigation 
        activePage={activePage} 
        onPageChange={handlePageChange} 
        collapsed={navCollapsed} 
        onToggle={toggleNav} 
      />
      <main className={navCollapsed ? 'expanded' : ''}>
        {activePage === 'dashboard' && <Dashboard />}
        {activePage === 'search' && <SearchPatients />}
        {activePage === 'book' && <BookAppointment />}
      </main>
    </div>
  );
}

export default App;