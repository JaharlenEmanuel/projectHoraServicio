import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { logout } from "../services/auth";

export default function Servicios() {
  const [animate, setAnimate] = useState(false);

  const carouselImages = [
    "/1._referir.jpg",
    "/2._Actividad_presencial.jpg",
    "/3._indexacion.jpg",
    "/4._Otros_servicios.png",
    "/5._Obrero.jpg",
    "/6._Ir_al_Templo.png",
    "/7.Actividad_Grupal.jpg",
  ];

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen relative px-6 py-12 bg-black overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          src="/video.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        <div className="w-full mb-12 relative">
          <img
            src="/presentacion.png"
            alt="Presentación"
            className={`w-full rounded-3xl shadow-2xl hover:scale-105 hover:rotate-1 transition-transform duration-700 ${animate ? "gelatinaNeon" : ""
              }`}
            style={{ height: "auto" }}
          />
        </div>

        <Cards carouselImages={carouselImages} />
      </div>

      <style jsx global>{`
        @tailwind utilities;
        @layer utilities {
          @keyframes gelatina {
            0% {
              transform: translateY(-300px) scaleX(0.8) scaleY(1.2);
              filter: drop-shadow(0 0 20px #00ffff);
            }
            30% {
              transform: translateY(0) scaleX(1.1) scaleY(0.9);
              filter: drop-shadow(0 0 40px #00ffff);
            }
            50% {
              transform: translateY(-20px) scaleX(0.95) scaleY(1.05);
              filter: drop-shadow(0 0 35px #00ffff);
            }
            70% {
              transform: translateY(10px) scaleX(1.02) scaleY(0.98);
              filter: drop-shadow(0 0 30px #00ffff);
            }
            100% {
              transform: translateY(0) scaleX(1) scaleY(1);
              filter: drop-shadow(0 0 25px #00ffff);
            }
          }
          .gelatinaNeon {
            animation: gelatina 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)
              forwards;
          }
        }
      `}</style>
    </div>
  );
}
