import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReports } from '../services/api';
import { getProfile } from '../services/auth';
import { useNotifications } from '../context/NotificacionContext';

export default function EstadosDeHoras() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { checkForNewComments } = useNotifications();

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const userData = getProfile();
    setUser(userData);
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Cargando servicios del usuario...');
      const response = await getReports();
      console.log(response)

      if (response.data) {
        console.log('Servicios cargados:', response.data);
        setServices(response.data);

        // comentarios de admin
        checkForNewComments(response.data);
      } else {
        setError('No se pudieron cargar los servicios');
      }

    } catch (error) {
      console.error('Error cargando servicios:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calcular estadísticas
  const calculateStats = () => {
    const stats = {
      totalHours: 0,
      approvedHours: 0,
      pendingHours: 0,
      rejectedHours: 0,
      totalServices: services.length
    };

    services.forEach(service => {
      const hours = parseInt(service.amount_reported) || 0;
      stats.totalHours += hours;

      const status = service.status?.toLowerCase();
      if (status === 'approved' || status === 'aprobado') {
        stats.approvedHours += hours;
      } else if (status === 'pending') {
        stats.pendingHours += hours;
      } else if (status === 'rejected') {
        stats.rejectedHours += hours;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  // Filtrar servicios
  const filteredServices = services.filter(service => {
    // Filtrar por búsqueda
    const matchesSearch = searchTerm === '' ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrar por estado
    const serviceStatus = service.status?.toLowerCase();
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'approved' && serviceStatus === 'approved') ||
      (statusFilter === 'pending' && serviceStatus === 'pending') ||
      (statusFilter === 'rejected' && serviceStatus === 'rejected');

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';

    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') {
      return 'bg-green-100 text-green-800 border border-green-200';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    } else if (statusLower === 'rejected') {
      return 'bg-red-100 text-red-800 border border-red-200';
    }
    return 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getStatusText = (status) => {
    if (!status) return 'Desconocido';

    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return 'Aprobado';
    if (statusLower === 'pending') return 'Pendiente';
    if (statusLower === 'rejected') return 'Rechazado';
    return status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Estado de mis horas
              </h1>
              <p className="text-gray-600 mt-2">
                {user?.name || 'Mis servicios reportados'}
              </p>
            </div>
            <button
              onClick={() => navigate('/servicios')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full md:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Servicio
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-blue-600">⏱️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horas Totales</p>
                  <p className="text-xl font-bold text-gray-800">{stats.totalHours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600">✅</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horas Aprobadas</p>
                  <p className="text-xl font-bold text-gray-800">{stats.approvedHours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-yellow-600">⏳</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horas Pendientes</p>
                  <p className="text-xl font-bold text-gray-800">{stats.pendingHours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-gray-600">📋</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Servicios</p>
                  <p className="text-xl font-bold text-gray-800">{stats.totalServices}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="approved">Aprobados</option>
                <option value="pending">Pendientes</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
            <button
              onClick={loadServices}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 mr-2">⚠️</div>
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
            <button
              onClick={loadServices}
              className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla de servicios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-5xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'No se encontraron servicios'
                  : 'No tienes servicios registrados'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Prueba con otros filtros de búsqueda'
                  : 'Comienza reportando tus primeras horas de servicio'}
              </p>
              <button
                onClick={() => navigate('/servicios')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear mi primer servicio
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas Reportadas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horas Aprobadas
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comentario
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="text-sm font-mono text-gray-900">
                          #{service.id}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {service.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {service.category?.name || 'Sin categoría'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {service.amount_reported || 0} horas
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900">
                          {service.amount_approved ? `${service.amount_approved} horas` : 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-900 whitespace-nowrap">
                          {formatDate(service.created_at)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(service.status)}`}>
                          {getStatusText(service.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {service.comment || 'Sin comentarios'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumen */}
        {services.length > 0 && (
          <div className="mt-4 text-center text-gray-500 text-sm">
            Mostrando {filteredServices.length} de {services.length} servicios
          </div>
        )}
      </div>
    </div>
  );
}