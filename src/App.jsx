import { useState } from 'react'
import cbLogo from './assets/codebeamer.svg'
import './App.css'
// import ConnectionSetup from './pages/connectionSetup.jsx'
// import GenerateItems from './pages/GenerateItems.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://www.ptc.com/en/products/codebeamer" target="_blank">
          <img src={cbLogo} className="logo" alt="Codebeamer logo" />
        </a>
      </div>
      <h1>Codebeamer AI Demo Generator</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>
      </div>
    </>
  )
}

export default App
