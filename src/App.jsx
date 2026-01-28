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
    <>
      <div>
        {backendError && (
          <div style={{ color: 'red', padding: '1rem' }}>
            ⚠️ Server is unavailable. Please try again later.
          </div>
        )}
        <a href="https://www.ptc.com/en/products/codebeamer" target="_blank">
          <img src={cbLogo} className="logo" alt="Codebeamer logo" />
        </a>
      </div>
      <h1>Codebeamer Demo Generator</h1>
      <NavBar/>
      <main className="container">
        <Routes>
          <Route path="/" element={<ConnectionSetup/>} />
          <Route path="/GenerateItems" element={<GenerateItems/>}/>
          <Route path="/GenerateTraceability" element={<GenerateTraceability/>} />
          <Route path="/UpdateItemStatuses" element={<UpdateItemStatuses/>}/>
          <Route path="/UpdateItemMetadata" element={<UpdateItemMetadata/>}/>
          <Route path="/TestRunGenerator" element={<TestRunGenerator/>}/>
          <Route path="/GenerateTestSteps" element={<GenerateTestSteps/>}/>
          <Route path="/DeleteAllProjectData" element={<DeleteAllProjectData/>}/>
          <Route path="/DeleteAllTrackerData" element={<DeleteAllTrackerData/>}/>
          <Route path="/BatchItemGenerator" element={<BatchItemGenerator/>}/>
        </Routes>
      </main>
      {/* <div>
        <ConnectionSetup></ConnectionSetup>
        <GenerateTraceability></GenerateTraceability>
        <UpdateItemStatuses></UpdateItemStatuses>
        <UpdateItemMetadata></UpdateItemMetadata>
        <TestRunGenerator></TestRunGenerator>
        <GenerateTestSteps></GenerateTestSteps>
        <DeleteAllProjectData></DeleteAllProjectData>
        <DeleteAllTrackerData></DeleteAllTrackerData>
        <BatchItemGenerator></BatchItemGenerator>
      </div> */}
    </>
  )
}

export default App
