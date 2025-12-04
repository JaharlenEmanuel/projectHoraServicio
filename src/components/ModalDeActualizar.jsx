import React, { useState, useRef, useEffect } from "react";

export default function ModalActualizar({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    cantidad: "",
    descripcion: "",
    categoriaId: "",
    evidencia: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      console.log("Datos actualizados:", formData);
      alert("Horas actualizadas correctamente ✅");
      setLoading(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-xl relative flex flex-col max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-800">
          Actualizar Horas de Servicio
        </h2>

        <div className="grow overflow-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Cantidad de horas reportadas
              </label>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Cantidad de horas reportadas"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-600"
                placeholder="Ej: Revisión de registros familiares"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Categoría
              </label>
              <select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2  focus:ring-2 focus:ring-blue-600"
                required
              >
                <option value="">Selecciona una categoría...</option>
                <option value="1">
                  Templo e Historia familiar, Indexación
                </option>
                <option value="2">Instructor</option>
                <option value="3">Liderazgo</option>
                <option value="4">Revisión</option>
                <option value="5">Asistencia al templo</option>
                <option value="13">Templo</option>
                <option value="15">Otra categoría</option>
              </select>
            </div>
            <div></div>

            {loading && (
              <p className="text-blue-600 font-bold">Actualizando…</p>
            )}
            {error && <p className="text-red-600 font-bold">{error}</p>}

            <button
              type="submit"
              className={`w-full bg-blue-800 text-white font-semibold py-2 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
