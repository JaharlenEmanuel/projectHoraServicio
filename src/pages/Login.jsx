import React, { useState } from 'react';
import { login, getProfile, getStoredRole } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Primero hacer login
      await login(email, password);
      console.log('✅ Login exitoso');

      // 2. Obtener el perfil (esto guardará automáticamente el rol en localStorage)
      const profileResponse = await getProfile();
      console.log('✅ Perfil obtenido:', profileResponse.data);
      console.log('✅ Rol detectado:', profileResponse.role);

      // 3. Obtener rol desde localStorage (asegurarnos que esté guardado)
      const storedRole = getStoredRole();
      console.log('💾 Rol en localStorage:', storedRole);

      // 4. Redirigir según el rol
      if (storedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        // Si es estudiante o cualquier otro rol
        navigate('/servicios');
      }

    } catch (error) {
      console.error('❌ Login error:', error);
      setError(error.response?.data?.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const [recordar, setRecordar] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Video */}
      <div className="hidden lg:flex lg:w-11/16 p-12 flex-col justify-center items-start text-white relative overflow-hidden bg-[#1a2332]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source src="/images/intro.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Login */}
      <div className="w-full lg:w-5/16 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-linear-to-br from-[#126aee] to-[#126aee] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl font-bold">F</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Portal Estudiante FUNVAL
            </h2>
            <p className="text-gray-600">
              Ingrese sus credenciales para continuar
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Usuario o Número de Matrícula
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#126aee] focus:border-transparent outline-none transition-all duration-200 bg-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarContrasena ? "text" : "password"}
                  id="contrasena"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6600] focus:border-transparent outline-none transition-all duration-200 bg-white pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {mostrarContrasena ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  className="w-4 h-4 text-[#126aee] border-gray-300 rounded focus:ring-[#126aee] cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                  Recordarme
                </span>
              </label>
              <a
                href="#"
                className="text-sm text-[#126aee] hover:text-[#126aee] font-medium transition-colors"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-[#126aee] to-[#126aee] text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#126aee] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Necesita ayuda?{' '}
              <a href="#" className="text-[#ff6600] hover:text-[#126aee] font-medium transition-colors">
                Contacte soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}