import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/Navbar.jsx';
import cbLogo from './assets/codebeamer.svg';
import './App.css';

// imports all of the page components
import ConnectionSetup from './pages/ConnectionSetup.jsx';
import GenerateItems from './pages/GenerateItems.jsx';
import GenerateTraceability from './pages/GenerateTraceability.jsx';
import UpdateItemStatuses from './pages/UpdateItemStatuses.jsx';
import UpdateItemMetadata from './pages/UpdateItemMetadata.jsx';
import TestRunGenerator from './pages/TestRunGenerator.jsx';
import GenerateTestSteps from './pages/GenerateTestSteps.jsx';
import DeleteAllProjectData from './pages/DeleteAllProjectData.jsx';
import DeleteAllTrackerData from './pages/DeleteAllTrackerData.jsx';
import BatchItemGenerator from './pages/BatchItemGeneration.jsx';

function App() {
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [backendError, setBackendError] = React.useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        console.log('API_BASE_URL =', API_BASE_URL); // should log http://localhost:8000 in dev
        const res = await fetch(`${API_BASE_URL}/api/greet`);
        if (!res.ok) throw new Error('Server error');
        await res.json(); // you can log this if needed
      } catch (err) {
        console.error('Backend unreachable:', err);
        setBackendError(true);
      }
    };

    pingBackend();
  }, []);




  return (
    <div className="layout">
      {/* Header: logo + small title, pinned top-left */}
      <header className="header" role="banner">
        <a
          href="https://codebeamer.com"
          target="_blank"
          rel="noreferrer"
          className="brand"
        >
          <img src={cbLogo} alt="Codebeamer logo" className="logo" />
          <span className="title">Codebeamer Demo Generator</span>
        </a>
      </header>

      {/* Left sidebar: render the existing NavBar HERE */}
      <aside className="sidebar" role="navigation" aria-label="Primary">
        <div className="sidebar-inner">
          <NavBar />
        </div>
      </aside>


      {/* Main content area: routed content is centered */}
      <main className="main" role="main">
        {backendError && (
          <div className="banner banner--error" role="alert" aria-live="polite">
            ⚠️ Server is unavailable. Please try again later.
          </div>
        )}

        <div className="content">
          <Routes>
            <Route path="/" element={<ConnectionSetup />} />
            <Route path="/GenerateItems" element={<GenerateItems />} />
            <Route path="/GenerateTraceability" element={<GenerateTraceability />} />
            <Route path="/UpdateItemStatuses" element={<UpdateItemStatuses />} />
            <Route path="/UpdateItemMetadata" element={<UpdateItemMetadata />} />
            <Route path="/TestRunGenerator" element={<TestRunGenerator />} />
            <Route path="/GenerateTestSteps" element={<GenerateTestSteps />} />
            <Route path="/DeleteAllProjectData" element={<DeleteAllProjectData />} />
            <Route path="/DeleteAllTrackerData" element={<DeleteAllTrackerData />} />
            <Route path="/BatchItemGenerator" element={<BatchItemGenerator />} />
          </Routes>
        </div>
      </main>
    </div>
  );

}

export default App
