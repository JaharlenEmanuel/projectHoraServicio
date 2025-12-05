import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getStoredUser } from "../services/auth";
import { useNotifications } from "../context/NotificacionContext";

export default function LoginDropdown({ isOpen, onClose, onLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(!!getStoredUser());
  const [showNotifications, setShowNotifications] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotifications();

  useEffect(() => {
    setIsLogged(!!getStoredUser());
  }, [location]);

  if (!isOpen) return null;

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate("/login");
    }
    onClose();
  };

  const handleProfile = () => {
    const user = getStoredUser();
    if (user) navigate("/profile");
    else navigate("/login");
    onClose();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    } finally {
      navigate("/");
      onClose();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  };

  return (
    <div className="absolute right-0 mt-3 z-50 select-none">
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlide { animation: fadeSlide 0.2s ease-out forwards; }
      `}</style>

      <div className="flex justify-end pr-5 animate-fadeSlide">
        <div className="w-3 h-3 bg-white/95 rotate-45 shadow-md border border-blue-100" />
      </div>

      <div
        className="
          w-72 rounded-2xl shadow-xl animate-fadeSlide p-5
          bg-linear-to-br from-white via-blue-50/40 to-white 
          border border-blue-100 backdrop-blur-lg
        "
      >
        <h3 className="text-lg font-semibold text-center text-blue-900 mb-3">
          Panel de usuario
        </h3>
        <div className="h-px bg-blue-100 mb-4" />

        {!isLogged ? (
          <button
            className="
              w-full py-2.5 rounded-xl text-white font-medium
              bg-linear-to-r from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              shadow-md hover:shadow-lg transition
            "
            onClick={handleLogin}
          >
            Iniciar sesión
          </button>
        ) : (
          <div className="flex flex-col space-y-3">
            {/* Notificaciones Button - Only visible on mobile (hidden on lg+) */}
            <div className="lg:hidden">
              <button
                className="
                  w-full py-2.5 rounded-xl font-medium text-blue-800 bg-white hover:bg-blue-50
                  border border-blue-200 shadow-sm hover:shadow-md transition flex items-center justify-center space-x-2
                  relative
                "
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span>🔔</span>
                <span>Notificaciones</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile Notifications Dropdown */}
              {showNotifications && (
                <div className="mt-2 max-h-64 overflow-y-auto bg-white rounded-xl border border-blue-200 shadow-lg">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="text-2xl mb-2">📭</div>
                      <p className="text-sm">No hay notificaciones</p>
                    </div>
                  ) : (
                    <>
                      <div className="sticky top-0 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-700">
                          {unreadCount} sin leer
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Marcar todas como leídas
                          </button>
                        )}
                      </div>
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                            }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-800">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></span>
                            )}
                          </div>
                        </div>
                      ))}
                      {notifications.length > 5 && (
                        <button
                          onClick={() => {
                            navigate('/estado');
                            onClose();
                          }}
                          className="w-full p-2 text-xs text-blue-600 hover:bg-blue-50"
                        >
                          Ver todas las notificaciones
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className="
                w-full py-2.5 rounded-xl font-medium text-blue-800 bg-white hover:bg-blue-50
                border border-blue-200 shadow-sm hover:shadow-md transition flex items-center justify-center space-x-2
              "
              onClick={handleProfile}
            >
              <span>Ver perfil</span>
            </button>

            <button
              className="
                w-full py-2.5 rounded-xl font-medium text-blue-700 bg-white hover:bg-blue-50
                border border-blue-200 shadow-sm hover:shadow-md transition flex items-center justify-center space-x-2
              "
              onClick={handleLogout}
            >
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
