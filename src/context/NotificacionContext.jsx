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

    // Cargar notificaciones desde localStorage al iniciar
    useEffect(() => {
        const storedNotifications = localStorage.getItem('notifications');
        if (storedNotifications) {
            const parsed = JSON.parse(storedNotifications);
            setNotifications(parsed);
            setUnreadCount(parsed.filter(n => !n.read).length);
        }
    }, []);

    // Guardar notificaciones en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    // Agregar notificación (se llamará cuando un estudiante cree un servicio)
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
            link: '/servicios' // Redirige a la página de servicios
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