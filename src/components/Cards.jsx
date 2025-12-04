import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalServicio from "./ModalServicios";
import ModalActualizar from "./ModalDeActualizar";
import Carousel from "../components/Carousel";

export default function Cards({ carouselImages }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalActualizarOpen, setIsModalActualizarOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenModalActualizar = () => setIsModalActualizarOpen(true);
  const handleCloseModalActualizar = () => setIsModalActualizarOpen(false);

  const handleRevisarClick = () => navigate("/estado");

  return (
    <>
      <ModalServicio isOpen={isModalOpen} onClose={handleCloseModal} />

      <ModalActualizar
        isOpen={isModalActualizarOpen}
        onClose={handleCloseModalActualizar}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full justify-items-center">
        {[
          { title: "Reportar Horas", btn: "Ingresar", carousel: true },
          {
            title: "Revisar el estado de mis horas",
            btn: "Revisar",
            videoFile: "/estado.mp4",
          },
          {
            title: "Actualizar reporte",
            btn: "Actualizar",
            videoFile: "/actualizar.mp4",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative flex flex-col rounded-3xl p-8 lg:p-10 bg-black/70 border border-yellow-400/30 shadow-[0_12px_30px_rgba(0,255,255,0.4)] hover:shadow-[0_18px_50px_rgba(0,255,255,0.8)] hover:-translate-y-3 transition-all duration-500 cursor-pointer w-full max-w-md"
          >
            {/* Carrusel o video */}
            {item.carousel ? (
              <div className="w-full aspect-3/2 lg:aspect-4/3 mb-8 rounded-2xl overflow-hidden">
                <Carousel images={carouselImages} />
              </div>
            ) : item.videoFile ? (
              <div className="w-full aspect-3/2 lg:aspect-4/3 mb-8 rounded-2xl overflow-hidden">
                <video
                  src={item.videoFile}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            ) : (
              <div className="w-full aspect-3/2 lg:aspect-4/3 bg-linear-to-br from-blue-500 via-cyan-300 to-white rounded-2xl shadow-inner mb-8 hover:scale-105 transition-transform duration-500" />
            )}

            {/* Título */}
            <h3 className="text-3xl font-semibold text-white mb-6 drop-shadow-md text-center">
              {item.title}
            </h3>

            {/* ==== BOTONES CON EFECTO CLICK (active:scale-95) ==== */}
            {item.title === "Reportar Horas" ? (
              <button
                onClick={handleOpenModal}
                className="mt-auto w-full py-4 rounded-2xl text-lg font-semibold 
                bg-linear-to-r from-cyan-500 via-blue-500 to-white text-black 
                shadow-[0_8px_25px_rgba(0,255,255,0.4)]
                hover:shadow-[0_12px_35px_rgba(0,255,255,0.7)]
                hover:brightness-110
                active:scale-95
                transition-transform duration-200
                flex justify-center items-center"
              >
                {item.btn}
              </button>
            ) : item.title === "Actualizar reporte" ? (
              <button
                onClick={handleOpenModalActualizar}
                className="mt-auto w-full py-4 rounded-2xl text-lg font-semibold 
                bg-linear-to-r from-cyan-500 via-blue-500 to-white text-black 
                shadow-[0_8px_25px_rgba(0,255,255,0.4)]
                hover:shadow-[0_12px_35px_rgba(0,255,255,0.7)]
                hover:brightness-110
                active:scale-95
                transition-transform duration-200
                flex justify-center items-center"
              >
                {item.btn}
              </button>
            ) : item.title === "Revisar el estado de mis horas" ? (
              <button
                onClick={handleRevisarClick}
                className="mt-auto w-full py-4 rounded-2xl text-lg font-semibold 
                bg-linear-to-r from-cyan-500 via-blue-500 to-white text-black 
                shadow-[0_8px_25px_rgba(0,255,255,0.4)]
                hover:shadow-[0_12px_35px_rgba(0,255,255,0.7)]
                hover:brightness-110
                active:scale-95
                transition-transform duration-200
                flex justify-center items-center"
              >
                {item.btn}
              </button>
            ) : (
              <button
                className="mt-auto w-full py-4 rounded-2xl text-lg font-semibold 
                bg-linear-to-r from-cyan-500 via-blue-500 to-white text-black 
                shadow-[0_8px_25px_rgba(0,255,255,0.4)]
                hover:shadow-[0_12px_35px_rgba(0,255,255,0.7)]
                hover:brightness-110
                active:scale-95
                transition-transform duration-200
                flex justify-center items-center"
              >
                {item.btn}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
