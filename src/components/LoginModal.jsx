import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getStoredUser } from "../services/auth";

export default function LoginDropdown({ isOpen, onClose, onLoginClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(!!getStoredUser());

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
