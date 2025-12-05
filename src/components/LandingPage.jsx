import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking localStorage
    const userRole = localStorage.getItem('user_role');
    const userData = localStorage.getItem('user_data');
    setIsLoggedIn(!!(userRole || userData));
  }, []);

  const log = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 w-full h-full bg-center bg-cover -z-10"
        style={{ backgroundImage: `url(/Fondo.jpg)` }}
      ></div>

      {/* Canva */}
      <div className="flex flex-col items-center justify-center p-2 pt-4 md:p-4 md:pt-8 mb-4 md:mb-0">
        <div className="w-full max-w-3xl 2xl:max-w-5xl shadow-lg rounded-lg overflow-hidden bg-white">
          <div style={{ position: 'relative', width: '100%', height: 0, paddingTop: '56.25%' }}>
            <iframe
              loading="lazy"
              style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }}
              src="https://www.canva.com/design/DAF7qbeV58w/yLZ0glEC1sJFuwqIcOzkrA/view?embed&autoplay=true"
              allowFullScreen={true}
              allow="fullscreen"
              title="Canva Presentation"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Video */}
      <div className="w-full min-h-[60vh] md:min-h-screen flex flex-col justify-center items-center p-2 md:p-4">
        <div
          className="bg-black bg-opacity-30 p-2 rounded-xl shadow-2xl w-full max-w-3xl 2xl:max-w-5xl 2xl:p-6 2xl:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
          style={{ aspectRatio: "16/9" }}
        >
          <iframe
            className="w-full h-full rounded-xl"
            src="https://www.youtube.com/embed/uDJZYx_oqU0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {!isLoggedIn && (
          <button
            onClick={log}
            className="mt-6 px-6 py-3 bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 hover:from-orange-500 hover:to-yellow-500 transition-transform duration-300">
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );
}
