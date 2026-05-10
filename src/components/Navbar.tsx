import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useState } from "react";

export default function Navbar() {
  const { token, isAdmin, logout } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const total = items.reduce((s, i) => s + i.quantity, 0);

  const navLink = (to: string, label: string) => (
    <Link to={to}
      className={`px-4 py-2 rounded-2xl font-body font-500 text-sm transition-all ${location.pathname === to ? "bg-brand-500 text-white shadow-toy" : "text-gray-600 hover:bg-brand-50 hover:text-brand-600"}`}>
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center text-lg shadow-toy">🧸</div>
          <span className="font-display font-800 text-xl text-gray-900">Toy<span className="text-gradient">World</span></span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLink("/", "Inicio")}
          {navLink("/shop", "Tienda")}
          {token && navLink("/orders", "Mis Pedidos")}
          {isAdmin && navLink("/admin", "⚙️ Admin")}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative p-2 rounded-xl hover:bg-brand-50 transition">
            <span className="text-xl">🛒</span>
            {total > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 gradient-brand text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                {total}
              </span>
            )}
          </Link>
          {token ? (
            <button onClick={logout}
              className="px-4 py-2 rounded-2xl text-sm font-500 text-rose-500 hover:bg-rose-50 transition">
              Salir
            </button>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-2xl text-sm font-500 text-gray-600 hover:bg-gray-100 transition">Entrar</Link>
              <Link to="/register" className="px-4 py-2 rounded-2xl text-sm font-600 gradient-brand text-white shadow-toy hover:shadow-hover transition-all">Registro</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
