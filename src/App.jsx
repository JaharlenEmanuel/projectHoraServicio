import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Reports from './pages/admin/Reports';
import Categories from './pages/admin/Categories';
import Profile from './pages/shared/Profile'; // Importar desde la ubicación correcta

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />

        {/* Ruta pública del perfil - CORREGIDO */}
        <Route path="/profile" element={<Profile />} />

        {/* Redirección desde /admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Rutas protegidas del admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="categories" element={<Categories />} />
          {/* No incluir profile aquí ya que está en ruta pública */}
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