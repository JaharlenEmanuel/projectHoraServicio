import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalServicio from "./ModalServicios";
import ModalActualizar from "./ModalDeActualizar";
import Carousel from "../components/Carousel";

export default function Cards({ carouselImages }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalActualizarOpen, setIsModalActualizarOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Para manejar estado de carga
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenModalActualizar = () => setIsModalActualizarOpen(true);
  const handleCloseModalActualizar = () => setIsModalActualizarOpen(false);

  const handleRevisarClick = () => {
    // Agregar un pequeño efecto de carga opcional
    setLoading(true);

    // Redirigir inmediatamente
    navigate("/estado");

    // Limpiar estado de carga después de un tiempo
    setTimeout(() => setLoading(false), 500);
  };

  // Datos para las tarjetas
  const cardData = [
    {
      title: "Reportar Horas",
      btn: "Ingresar",
      carousel: true,
      action: handleOpenModal,
      description: "Registra nuevas horas de servicio"
    },
    {
      title: "Revisar el estado de mis horas",
      btn: loading ? "Cargando..." : "Revisar",
      videoFile: "/estado.mp4",
      action: handleRevisarClick,
      description: "Consulta el estado de tus reportes"
    },
    {
      title: "Actualizar reporte",
      btn: "Actualizar",
      videoFile: "/actualizar.mp4",
      action: handleOpenModalActualizar,
      description: "Modifica reportes existentes"
    },
  ];

  return (
    <>
      {/* Modales */}
      <ModalServicio isOpen={isModalOpen} onClose={handleCloseModal} />
      <ModalActualizar isOpen={isModalActualizarOpen} onClose={handleCloseModalActualizar} />

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full justify-items-center">
        {cardData.map((item, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-3xl p-6 lg:p-8 bg-black/80 border border-yellow-400/30 shadow-[0_12px_30px_rgba(0,255,255,0.3)] hover:shadow-[0_18px_50px_rgba(0,255,255,0.6)] hover:-translate-y-2 transition-all duration-500 cursor-pointer w-full max-w-md group"
          >
            {/* Indicador de carga para el botón "Revisar" */}
            {item.title === "Revisar el estado de mis horas" && loading && (
              <div className="absolute inset-0 bg-black/70 rounded-3xl z-10 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Carrusel o video */}
            <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden">
              {item.carousel ? (
                <Carousel images={carouselImages} />
              ) : item.videoFile ? (
                <video
                  src={item.videoFile}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : null}
            </div>

            {/* Título */}
            <h3 className="text-2xl font-bold text-white mb-3 text-center">
              {item.title}
            </h3>

            {/* Descripción */}
            <p className="text-gray-300 text-sm text-center mb-6">
              {item.description}
            </p>

            {/* Botón */}
            <button
              onClick={item.action}
              disabled={loading && item.title === "Revisar el estado de mis horas"}
              className={`mt-auto w-full py-3.5 rounded-xl text-lg font-semibold 
                bg-linear-to-r from-cyan-500 via-blue-500 to-white text-black 
                shadow-[0_8px_20px_rgba(0,255,255,0.3)]
                hover:shadow-[0_12px_30px_rgba(0,255,255,0.5)]
                hover:brightness-110
                active:scale-95
                transition-all duration-200
                flex justify-center items-center gap-2
                ${loading && item.title === "Revisar el estado de mis horas" ? 'opacity-80' : ''}`}
            >
              {item.btn}
              {/* Icono según el botón */}
              {item.title === "Reportar Horas" && "➕"}
              {item.title === "Revisar el estado de mis horas" && "📋"}
              {item.title === "Actualizar reporte" && "✏️"}
            </button>
          </div>
        ))}
      </div>

      {/* Información adicional */}
      <div className="mt-12 text-center">
        <p className="text-gray-300 text-sm">
          💡 <strong>Consejo:</strong> Revisa regularmente el estado de tus reportes para mantener tu progreso actualizado.
        </p>
      </div>
    </>
  );
}