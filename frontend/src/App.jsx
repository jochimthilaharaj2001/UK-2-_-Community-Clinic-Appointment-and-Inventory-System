
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
    <div className="p-6">
      <Routes>
        <Route path="/doctor" element={<DoctorDashboard/>}/>
      </Routes>
    </div>
    </BrowserRouter>
     
  );
}
