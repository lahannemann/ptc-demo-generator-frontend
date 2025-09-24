import { useState } from 'react'
import cbLogo from './assets/codebeamer.svg'
import './App.css'

// imports all of the page components
import ConnectionSetup from './pages/connectionSetup.jsx'
// import GenerateItems from './pages/GenerateItems.jsx'
import GenerateTraceability from './pages/GenerateTraceability.jsx'
import UpdateItemStatuses from './pages/UpdateItemStatuses.jsx'
import UpdateItemMetadata from './pages/UpdateItemMetadata.jsx'
import TestRunGenerator from './pages/TestRunGenerator.jsx'
import GenerateTestSteps from './pages/GenerateTestSteps.jsx'
import DeleteAllProjectData from './pages/DeleteAllProjectData.jsx'
import DeleteAllTrackerData from './pages/DeleteAllTrackerData.jsx'
import BatchItemGenerator from './pages/BatchItemGeneration.jsx'

function App() {

  return (
    <>
      <div>
        <a href="https://www.ptc.com/en/products/codebeamer" target="_blank">
          <img src={cbLogo} className="logo" alt="Codebeamer logo" />
        </a>
      </div>
      <h1>Codebeamer AI Demo Generator</h1>
      <div>
        <ConnectionSetup></ConnectionSetup>
        <GenerateTraceability></GenerateTraceability>
        <UpdateItemStatuses></UpdateItemStatuses>
        <UpdateItemMetadata></UpdateItemMetadata>
        <TestRunGenerator></TestRunGenerator>
        <GenerateTestSteps></GenerateTestSteps>
        <DeleteAllProjectData></DeleteAllProjectData>
        <DeleteAllTrackerData></DeleteAllTrackerData>
        <BatchItemGenerator></BatchItemGenerator>
      </div>
    </>
  )
}

export default App
