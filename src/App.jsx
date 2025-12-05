import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Login from "./pages/Login";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Reports from "./pages/admin/Reports";
import Categories from "./pages/admin/Categories";
import Servicios from "./pages/Servicios";
import LandingPage from "./components/LandingPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Profile from "./pages/shared/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="grow">
                <LandingPage />
              </main>
              <Footer />
            </div>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/profile"
          element={
            <AuthGuard requiredRole="student">
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="grow">
                  <Profile />
                </main>
                <Footer />
              </div>
            </AuthGuard>
          }
        />

        <Route
          path="/servicios"
          element={
            <AuthGuard requiredRole="student">
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="grow">
                  <Servicios />
                </main>
                <Footer />
              </div>
            </AuthGuard>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthGuard requiredRole="admin">
              <Navigate to="/admin/dashboard" replace />
            </AuthGuard>
          }
        />

        <Route
          path="/admin/*"
          element={
            <AuthGuard requiredRole="admin">
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="reports" element={<Reports />} />
          <Route path="categories" element={<Categories />} />
        </Route>

        {/* Redireccion */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <NotificationProvider>
        <Routes>
          {/* Ruta pública principal */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen">
              <Header />
              <LandingPage />
              <Footer />
            </div>
          } />

          {/* Ruta de login - pública */}
          <Route path="/login" element={<Login />} />

          {/* ===== RUTAS PROTEGIDAS PARA ESTUDIANTES ===== */}

          {/* Ruta de servicios - SOLO para estudiantes */}
          <Route path="/servicios" element={
            <AuthGuard requiredRole="student">
              <div className="flex flex-col min-h-screen">
                <Header />
                <Servicios />
                <Footer />
              </div>
            </AuthGuard>
          } />

          {/* Ruta de estado - SOLO para estudiantes */}
          <Route path="/estado" element={
            <AuthGuard requiredRole="student">
              <div className="flex flex-col min-h-screen">
                <Header />
                <EstadosDeHoras />
                <Footer />
              </div>
            </AuthGuard>
          } />

          {/* Ruta de perfil - para cualquier usuario autenticado */}
          <Route path="/profile" element={
            <AuthGuard>
              <div className="flex flex-col min-h-screen">
                <Header />
                <Profile />
                <Footer />
              </div>
            </AuthGuard>
          } />

          {/* ===== RUTAS PROTEGIDAS PARA ADMIN ===== */}

          <Route path="/admin" element={
            <AuthGuard requiredRole="admin">
              <Navigate to="/admin/dashboard" replace />
            </AuthGuard>
          } />

          <Route path="/admin/*" element={
            <AuthGuard requiredRole="admin">
              <AdminLayout />
            </AuthGuard>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="categories" element={<Categories />} />
          </Route>

          {/* Redirecciones */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
