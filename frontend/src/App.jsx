import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portal from './pages/PortalAccess.jsx'

export default function App() {
  return (

    <BrowserRouter>
      <div className='p-6'>
        <Routes>
        <Route path="/" element={< Portal/>} />

        {/* Add other routes here */}
      </Routes>
      </div>
    </BrowserRouter>
      
  )
}
