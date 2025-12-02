import React from "react";

export default function LandingPage() {
  return (
    <div
      className="w-full h-screen bg-center bg-cover flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(/Fondo.jpg)` }}
    >
      <div
        className="bg-black bg-opacity-30 p-2 rounded-xl shadow-2xl w-full max-w-3xl"
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

      <button className="mt-6 px-6 py-3 bg-linear-to-r from-orange-400 to-yellow-400 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 hover:from-orange-500 hover:to-yellow-500 transition-transform duration-300">
        Iniciar Sesión
      </button>
    </div>
  );
}
