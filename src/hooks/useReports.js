import { useState, useEffect } from 'react';
import axios from 'axios';

// Configurar axios para enviar credenciales (cookies)
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: 'https://www.hs-service.api.crealape.com/api/v1',
    headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true // IMPORTANTE: enviar cookies automáticamente
});

export const useReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await api.get('/services');
            setReports(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching reports:', err);

            if (err.response?.status === 401) {
                setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
                // Opcional: redirigir al login después de un tiempo
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else if (err.response?.status === 403) {
                setError('No tiene permisos para ver los reportes.');
            } else if (err.response?.status === 404) {
                setError('Endpoint no encontrado. Verifique la URL.');
            } else {
                setError(`Error al cargar los reportes: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (reportId, data) => {
        try {
            const response = await api.patch(`/review/${reportId}`, data);
            await fetchReports(); // Refrescar la lista
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error updating report:', err);

            if (err.response?.status === 401) {
                return {
                    success: false,
                    error: 'Sesión expirada. Por favor, inicie sesión nuevamente.'
                };
            }

            return {
                success: false,
                error: err.response?.data?.message || 'Error al actualizar el reporte'
            };
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    return {
        reports,
        loading,
        error,
        fetchReports,
        updateReportStatus
    };
};