import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import Servicios from "./pages/Servicios";
import EstadosDeHoras from "./pages/EstadosDeHoras"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
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
    </BrowserRouter>
  );
}
