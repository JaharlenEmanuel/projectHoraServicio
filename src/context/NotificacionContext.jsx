// context/NotificationContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStoredUser } from '../services/auth';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications debe usarse dentro de NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [checkedServices, setCheckedServices] = useState(new Set());

    // Cargar notificaciones desde localStorage al iniciar
    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        const storedCheckedServices = localStorage.getItem('checkedServices');

        if (storedNotifications) {
            const parsed = JSON.parse(storedNotifications);
            setNotifications(parsed);
            setUnreadCount(parsed.filter(n => !n.read).length);
        }

        if (storedCheckedServices) {
            setCheckedServices(new Set(JSON.parse(storedCheckedServices)));
        }
    }, []);

    // Guardar notificaciones en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Guardar servicios verificados en localStorage
    useEffect(() => {
        localStorage.setItem('checkedServices', JSON.stringify([...checkedServices]));
    }, [checkedServices]);

    // Agregar notificación de nuevo servicio (se llamará cuando un estudiante cree un servicio)
    const addNotification = (notification) => {
        const user = getStoredUser();
        const newNotification = {
            id: Date.now(),
            userId: user?.id || 'unknown',
            type: 'new_service',
            title: 'Nuevo Servicio Creado',
            message: notification.message || 'Has creado un nuevo servicio exitosamente.',
            timestamp: new Date().toISOString(),
            read: false,
            link: '/estado'
        };

        setNotifications(prev => [newNotification, ...prev]);

        // Opcional: mostrar notificación del sistema
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nuevo Servicio', {
                body: newNotification.message,
                icon: '/logo.png'
            });
        }
    };

    // Agregar notificación de comentario de admin
    const addCommentNotification = (serviceId, serviceName, comment) => {
        const user = getStoredUser();
        const newNotification = {
            id: Date.now() + Math.random(), // Asegurar ID único
            userId: user?.id || 'unknown',
            type: 'admin_comment',
            serviceId: serviceId,
            title: '💬 Nuevo Comentario del Administrador',
            message: `El administrador comentó en "${serviceName}": "${comment.substring(0, 80)}${comment.length > 80 ? '...' : ''}"`,
            timestamp: new Date().toISOString(),
            read: false,
            link: '/estado'
        };

        setNotifications(prev => {
            // Evitar duplicados para el mismo servicio
            const exists = prev.some(n =>
                n.type === 'admin_comment' &&
                n.serviceId === serviceId &&
                !n.read
            );

            if (exists) return prev;
            return [newNotification, ...prev];
        });

        // Notificación del sistema
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nuevo Comentario', {
                body: newNotification.message,
                icon: '/logo.png'
            });
        }
    };

    // Verificar servicios en busca de nuevos comentarios
    const checkForNewComments = (services) => {
        if (!services || !Array.isArray(services)) return;

        services.forEach(service => {
            // Solo procesar si el servicio tiene comentario y no ha sido verificado
            if (service.comment && service.comment.trim() !== '') {
                const serviceKey = `${service.id}-${service.comment}`;

                // Si no hemos visto este comentario antes, crear notificación
                if (!checkedServices.has(serviceKey)) {
                    const serviceName = service.description?.substring(0, 50) || `Servicio #${service.id}`;
                    addCommentNotification(service.id, serviceName, service.comment);

                    // Marcar como verificado
                    setCheckedServices(prev => new Set([...prev, serviceKey]));
                }
            }
        });
    };

    // Marcar notificación como leída
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    // Marcar todas como leídas
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    // Eliminar notificación
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Eliminar todas las notificaciones
    const clearAllNotifications = () => {
        setNotifications([]);
    };

    // Solicitar permisos para notificaciones del navegador
    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                addCommentNotification,
                checkForNewComments,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAllNotifications,
                requestNotificationPermission
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};