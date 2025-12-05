import axios from "axios";

const API_URL = "https://www.hs-service.api.crealape.com/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const clearUserData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_role");
  localStorage.removeItem("user_data");
  localStorage.removeItem("login_timestamp");
};

export const getStoredRole = () => {
  return localStorage.getItem("user_role") || null;
};

export const getStoredUser = () => {
  const saved = localStorage.getItem("user_data");
  return saved ? JSON.parse(saved) : null;
};

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });

  if (response.data?.token) {
    localStorage.setItem("token", response.data.token);
  }

  try {
    const profileResponse = await getProfile();
    const user = profileResponse.data;

    const roleName = user.role?.name || user.role || user.role_name || "user";
    const normalizedRole = roleName.toLowerCase();

    localStorage.setItem("user_role", normalizedRole);
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: normalizedRole,
      })
    );

    localStorage.setItem("login_timestamp", Date.now().toString());
  } catch (err) {
    console.warn("No se pudo obtener perfil después del login", err);
  }

  return response;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");

  const user = response.data;
  const roleName = user.role?.name || user.role || user.role_name || "user";
  const normalizedRole = roleName.toLowerCase();

  const currentRole = localStorage.getItem("user_role");

  if (!currentRole || currentRole !== normalizedRole) {
    localStorage.setItem("user_role", normalizedRole);
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: normalizedRole,
      })
    );
  }

  return response;
};

export const checkAuth = async (skipApiCheck = false) => {
  const role = localStorage.getItem("user_role");
  const userdata = getStoredUser();

  if (role && userdata) {
    const ts = localStorage.getItem("login_timestamp");
    if (ts) {
      const hours = (Date.now() - parseInt(ts)) / (1000 * 60 * 60);
      if (hours > 8) {
        console.log("Sesión expirada");
        clearUserData();
        return { isAuthenticated: false, isAdmin: false, user: null };
      }
    }

    if (skipApiCheck) {
      return {
        isAuthenticated: true,
        isAdmin: role === "admin",
        user: userdata,
        fromCache: true,
      };
    }
  }

  try {
    const response = await api.get("/auth/profile");
    const user = response.data;

    const roleName = user.role?.name || user.role || user.role_name || "user";
    const normalizedRole = roleName.toLowerCase();

    localStorage.setItem("user_role", normalizedRole);
    localStorage.setItem("user_data", JSON.stringify(user));
    localStorage.setItem("login_timestamp", Date.now().toString());

    return {
      isAuthenticated: true,
      isAdmin: normalizedRole === "admin",
      user,
    };
  } catch (err) {
    clearUserData();
    return { isAuthenticated: false, isAdmin: false, user: null };
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Error en logout del backend:", err);
  } finally {
    clearUserData();
  }

  return Promise.resolve();
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await api.put("/auth/change-password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response;
  } catch (error) {
    console.error(
      "Error al cambiar contraseña:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const isAdmin = () => getStoredRole() === "admin";
export const isStudent = () => getStoredRole() === "student";
export default api;
