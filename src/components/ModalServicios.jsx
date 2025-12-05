import React, { useState, useRef, useEffect } from "react";
import { useNotifications } from '../context/NotificacionContext';
import { api } from '../services/api';

export default function ModalService({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    amount_reported: "", // Cambiado de 'cantidad'
    description: "",     // Cambiado de 'descripcion'
    category_id: "",     // Cambiado de 'categoriaId'
    evidence: null,      // Cambiado de 'evidencia'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const { addNotification } = useNotifications();
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    // Cargar categorías cuando se abre el modal
    if (isOpen) {
      loadCategories();
      // Resetear form cuando se abre
      resetForm();
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      amount_reported: "",
      description: "",
      category_id: "",
      evidence: null,
    });
    setError(null);
    setSuccessMessage("");
  };

  // Función para cargar categorías desde la API
  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      console.log("Categorías cargadas:", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      // Si hay error, usar categorías por defecto
      setCategories([
        { id: 1, name: "Templo e Historia familiar, Indexación" },
        { id: 2, name: "Instructor" },
        { id: 3, name: "Liderazgo" },
        { id: 4, name: "Revisión" },
        { id: 5, name: "Asistencia al templo" },
        { id: 13, name: "Templo" },
        { id: 15, name: "Otra categoría" },
      ]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    // Validaciones básicas
    if (!formData.amount_reported || parseInt(formData.amount_reported) <= 0) {
      setError("Por favor ingresa una cantidad válida de horas (mínimo 1)");
      setLoading(false);
      return;
    }

    if (!formData.description || formData.description.trim() === "") {
      setError("Por favor ingresa una descripción del servicio");
      setLoading(false);
      return;
    }

    if (!formData.category_id) {
      setError("Por favor selecciona una categoría");
      setLoading(false);
      return;
    }

    try {
      // Crear FormData con los campos correctos según la API
      const formDataToSend = new FormData();

      // Agregar campos según el ejemplo de curl
      formDataToSend.append('amount_reported', formData.amount_reported);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category_id', formData.category_id);

      // Solo agregar evidence si existe
      if (formData.evidence) {
        // Validar tipo de archivo
        if (!formData.evidence.type.includes('pdf')) {
          setError("Solo se permiten archivos PDF");
          setLoading(false);
          return;
        }

        // Validar tamaño (10MB máximo)
        if (formData.evidence.size > 10 * 1024 * 1024) {
          setError("El archivo es demasiado grande (máximo 10MB)");
          setLoading(false);
          return;
        }

        formDataToSend.append('evidence', formData.evidence);
      }

      console.log("Enviando datos:", {
        amount_reported: formData.amount_reported,
        description: formData.description,
        category_id: formData.category_id,
        has_evidence: !!formData.evidence
      });

      // Enviar datos a la API
      const response = await api.post('/services', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("✅ Servicio creado exitosamente:", response.data);

      // AGREGAR NOTIFICACIÓN después de crear el servicio
      addNotification({
        type: 'new_service',
        title: '¡Servicio Creado!',
        message: `Has creado un servicio de ${formData.amount_reported} horas: "${formData.description.substring(0, 50)}${formData.description.length > 50 ? '...' : ''}"`,
        serviceId: response.data.id,
        timestamp: new Date().toISOString()
      });

      // Mostrar mensaje de éxito
      setSuccessMessage(`✅ Servicio creado exitosamente! ID: ${response.data.id}`);

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2000);

    } catch (error) {
      console.error("❌ Error al crear servicio:", error);

      // Manejar errores específicos
      if (error.response) {
        // El servidor respondió con un código de error
        const errorData = error.response.data;
        console.error("Datos del error:", errorData);

        if (error.response.status === 401) {
          setError("Tu sesión ha expirado. Por favor inicia sesión nuevamente.");
        } else if (error.response.status === 422) {
          // Errores de validación
          const validationErrors = errorData.errors || {};
          const errorMessages = Object.values(validationErrors).flat();
          setError(`Error de validación: ${errorMessages.join(', ')}`);
        } else if (error.response.status === 400) {
          setError(errorData.message || "Datos inválidos enviados al servidor");
        } else {
          setError(errorData.message || "Error al crear el servicio. Intenta nuevamente.");
        }
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        // Algo más causó el error
        setError("Error al crear el servicio: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el nombre de la categoría seleccionada
  const getCategoryName = () => {
    const category = categories.find(cat => cat.id == formData.category_id);
    return category ? category.name : "Categoría seleccionada";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative flex flex-col max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl font-bold z-10 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
          disabled={loading}
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-blue-600 text-xl">🛠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Reportar Horas de Servicio
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Completa los datos para registrar tus horas de servicio
          </p>
        </div>

        <div className="grow overflow-auto pr-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Cantidad de horas */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Cantidad de horas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount_reported"
                value={formData.amount_reported}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                placeholder="Ej: 10"
                min="1"
                step="1"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Número entero de horas reportadas
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Descripción del servicio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-28 disabled:bg-gray-100"
                placeholder="Describe detalladamente el servicio que realizaste..."
                required
                disabled={loading}
                maxLength="500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mínimo 10 caracteres</span>
                <span>{formData.description.length}/500</span>
              </div>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100"
                required
                disabled={loading}
              >
                <option value="">Selecciona una categoría...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Evidencia */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Evidencia (PDF) <span className="text-gray-500 text-xs font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <div
                  onClick={() => !loading && fileInputRef.current.click()}
                  className={`w-full border-2 border-dashed ${formData.evidence ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'} rounded-lg px-4 py-6 text-center cursor-pointer transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {formData.evidence ? (
                    <div className="text-green-700">
                      <div className="text-2xl mb-2">📄✅</div>
                      <p className="font-medium truncate">{formData.evidence.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {(formData.evidence.size / 1024).toFixed(1)} KB • PDF
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, evidence: null }));
                        }}
                        className="mt-2 text-red-500 text-sm hover:text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                      >
                        Eliminar archivo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="text-2xl mb-2">📎</div>
                      <p className="text-gray-700 font-medium">Haz clic para seleccionar archivo</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Solo PDF • Máximo 10MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  name="evidence"
                  ref={fileInputRef}
                  onChange={handleChange}
                  className="hidden"
                  accept=".pdf,application/pdf"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">📋</span> Resumen del servicio
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-gray-600">Horas reportadas:</span>
                  <span className="font-bold text-blue-700">{formData.amount_reported || "0"} horas</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-blue-100">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="font-medium text-gray-800">{getCategoryName()}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Evidencia:</span>
                  <span className={`font-medium ${formData.evidence ? "text-green-600" : "text-amber-600"}`}>
                    {formData.evidence ? "✅ PDF adjunto" : "⚠️ Sin evidencia"}
                  </span>
                </div>
              </div>
            </div>

            {/* Mensajes de éxito */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fadeIn">
                <p className="text-green-700 text-sm flex items-center">
                  <span className="mr-2 text-lg">🎉</span>
                  {successMessage}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Redirigiendo en 2 segundos...
                </p>
              </div>
            )}

            {/* Mensajes de error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-fadeIn">
                <p className="text-red-700 text-sm flex items-start">
                  <span className="mr-2 text-lg mt-0.5">⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${!loading && "hover:from-blue-700 hover:to-blue-800 active:scale-[0.98]"}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creando servicio...
                  </>
                ) : (
                  <>
                    <span className="mr-2">📤</span>
                    Crear Servicio
                  </>
                )}
              </button>
            </div>

            {/* Nota informativa */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 flex items-start">
                <span className="mr-2 text-base">💡</span>
                <span>
                  <strong>Importante:</strong> Tu servicio será revisado por un administrador.
                  Recibirás una notificación cuando haya cambios en su estado.
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}