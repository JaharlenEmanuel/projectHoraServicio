import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginDropdown from "./LoginModal";
import { checkAuth } from "../services/auth";
import { logout } from "../services/auth";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  const navigate = useNavigate();

  const updateLoginStatus = async () => {
    const { isAuthenticated } = await checkAuth();
    setIsLogged(isAuthenticated);
  };

  useEffect(() => {
    updateLoginStatus();
  }, []);

  useEffect(() => {
    const listener = () => updateLoginStatus();
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigation = (item) => {
    setIsMenuOpen(false);
    if (item === "Servicios") {
      navigate("/servicios");
    } else if (item === "Inicio") {
      navigate("/");
    } else if (item === "Contacto") {
      navigate("/contacto");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("user_data");

    setIsLogged(false);
    setIsLoginOpen(false);

    navigate("/login");
  };

  const toggleLoginMenu = () => {
    setIsLoginOpen((prev) => !prev);
  };

  return (
    <header className="bg-linear-to-r from-white via-cyan-100 to-blue-200 p-4 shadow-md relative z-50">
      <div className="w-full flex items-center justify-between px-4">
        <button
          className="md:block lg:hidden text-blue-900 focus:outline-none relative -ml-4 sm:-ml-6"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex-1 flex justify-center items-center px-4 2xl:ml-80">
          <img
            src="/funval.png"
            alt="Logo principal"
            className="h-14 lg:h-20 w-auto object-contain"
          />
        </div>

        {/* Mobile: Notification Bell + User Icon */}
        <div className="md:flex lg:hidden items-center space-x-2 -mr-4 sm:-mr-6">
          <NotificationBell />
          <img
            src="/usuario.png"
            alt="Login"
            onClick={toggleLoginMenu}
            className="h-10 w-10 object-contain cursor-pointer hover:scale-110 transition"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-7 text-lg text-blue-900 items-center">
          {["Inicio", "Servicios", "Contacto"].map((item) => (
            <span
              key={item}
              className="cursor-pointer transform transition hover:text-cyan-600 lg:active:scale-125"
              onClick={() => handleNavigation(item)}
            >
              {item}
            </span>
          ))}
          <div className="flex items-center space-x-3">
            <NotificationBell />
            <button onClick={toggleLoginMenu}>
              <img
                src="/usuario.png"
                alt="Login"
                className="h-10 w-10 object-contain cursor-pointer hover:scale-110 transition"
              />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-full bg-linear-to-br from-cyan-100 via-white to-blue-200 z-40 transform transition-all duration-500 ${isMenuOpen
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-12 opacity-0"
          }`}
      >
        <button
          className="absolute top-6 right-6 text-blue-900"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <nav className="flex flex-col items-center justify-center h-full space-y-10 text-blue-900 text-2xl font-semibold">
          {["Inicio", "Servicios", "Contacto"].map((item) => (
            <span
              key={item}
              className="transition hover:text-cyan-600 active:scale-125 cursor-pointer"
              onClick={() => handleNavigation(item)}
            >
              {item}
            </span>
          ))}
        </nav>
      </div>

      <div className="absolute right-6 top-20 lg:right-10 lg:top-24">
        <LoginDropdown
          isOpen={isLoginOpen}
          isLogged={isLogged}
          onLogin={() => navigate("/login")}
          onProfile={() => navigate("/profile")}
          onLogout={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
