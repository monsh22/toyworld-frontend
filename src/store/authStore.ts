import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  isAdmin: boolean;
  login: (token: string, isAdmin: boolean) => void;
  logout: () => void;
}

// Al cargar, verificar si el token guardado sigue válido
const savedToken = localStorage.getItem("token");
let savedIsAdmin = false;
if (savedToken) {
  try {
    const decoded: any = jwtDecode(savedToken);
    if (decoded.exp * 1000 > Date.now()) {
      savedIsAdmin = decoded.is_admin ?? false;
    } else {
      localStorage.removeItem("token");
    }
  } catch {
    localStorage.removeItem("token");
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  isAdmin: savedIsAdmin,
  login: (token, isAdmin) => {
    localStorage.setItem("token", token);
    set({ token, isAdmin });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, isAdmin: false });
  },
}));
