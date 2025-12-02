import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <LandingPage />

      <Footer />
    </div>
  );
}
