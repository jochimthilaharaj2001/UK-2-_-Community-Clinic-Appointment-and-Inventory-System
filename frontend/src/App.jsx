import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import InventoryPage from './pages/pharmacist/InventoryPage';


export default function App() {
  return (
    <BrowserRouter>
    <div className="p-6">
   <Routes>
    <Route path ="./doctor" element = {<DoctorDashboard/>}/>
   </Routes>
   </div>
   </BrowserRouter>
  )
}
