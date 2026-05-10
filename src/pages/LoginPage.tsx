import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuthStore();
  const navigate                = useNavigate();

  const handle = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const decoded: any = jwtDecode(data.access_token);
      login(data.access_token, decoded.is_admin);
      navigate(decoded.is_admin ? "/admin" : "/shop");
    } catch { setError("Correo o contraseña incorrectos"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#fff7ed 0%,#fef3c7 25%,#fce7f3 60%,#ede9fe 100%)"}}>

      {/* Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 blob opacity-30 blur-3xl float-1" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200 blob-2 opacity-25 blur-3xl float-2" />

      {/* Emojis flotantes */}
      <div className="absolute top-24 right-[10%] text-5xl float-1 select-none">🧸</div>
      <div className="absolute top-36 left-[8%] text-4xl float-2 select-none">⭐</div>
      <div className="absolute bottom-24 left-[15%] text-4xl float-3 select-none">🎪</div>
      <div className="absolute bottom-32 right-[12%] text-3xl float-1 select-none">🎀</div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-brand rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-hover float-1">🧸</div>
          <h1 className="font-display font-800 text-4xl text-gray-900">¡Bienvenido!</h1>
          <p className="text-gray-500 mt-1 text-lg">Inicia sesión en ToyWorld</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-4xl p-8 shadow-hover border border-white">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-600 text-gray-700 mb-2">📧 Correo electrónico</label>
              <input className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-400 focus:bg-white transition font-body text-base"
                placeholder="tu@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-600 text-gray-700 mb-2">🔒 Contraseña</label>
              <input className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-brand-400 focus:bg-white transition font-body text-base"
                placeholder="••••••••" type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handle()} />
            </div>
          </div>
          <button onClick={handle} disabled={loading}
            className="w-full gradient-brand text-white font-700 py-4 rounded-2xl mt-6 shadow-toy hover:shadow-hover transition-all hover:-translate-y-0.5 text-base disabled:opacity-60">
            {loading ? "Ingresando..." : "Iniciar Sesión →"}
          </button>
          <p className="text-center text-gray-400 text-sm mt-5">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-brand-500 font-700 hover:text-brand-600">Regístrate gratis 🎉</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
