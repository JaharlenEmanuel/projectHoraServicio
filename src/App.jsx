import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import Categories from './pages/admin/Categories';
import Profile from './pages/admin/Profile';

import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Servicios from "./pages/Servicios";
import EstadosDeHoras from "./pages/EstadosDeHoras"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/estado" element={<EstadosDeHoras />} />{" "}
        </Routes>

        <Footer />
      </div>
    

    <Routes>
      {/* Ruta de login */}
      <Route path="/login" element={<Login />} />

      {/* Redirección desde /admin */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Rutas protegidas del admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="categories" element={<Categories />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Ruta por defecto - redirigir a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Ruta para cualquier otra URL no definida */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;