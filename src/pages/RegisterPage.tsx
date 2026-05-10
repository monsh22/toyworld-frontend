import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handle = async () => {
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch { setError("Error al registrar. Verifica los datos."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#f0fdfa 0%,#ccfbf1 25%,#cffafe 50%,#ede9fe 80%,#fce7f3 100%)"}}>

      {/* Blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-mint-200 blob opacity-30 blur-3xl float-1" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-sky-200 blob-2 opacity-25 blur-3xl float-2" />

      {/* Emojis flotantes */}
      <div className="absolute top-28 left-[8%] text-5xl float-1 select-none">🎉</div>
      <div className="absolute top-20 right-[10%] text-4xl float-2 select-none">🧸</div>
      <div className="absolute bottom-28 right-[8%] text-4xl float-3 select-none">🌈</div>
      <div className="absolute bottom-20 left-[12%] text-3xl float-1 select-none">⭐</div>

      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-mint rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-hover float-2">🎉</div>
          <h1 className="font-display font-800 text-4xl text-gray-900">¡Únete a ToyWorld!</h1>
          <p className="text-gray-500 mt-1 text-lg">Crea tu cuenta gratis hoy</p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-4xl p-8 shadow-hover border border-white">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-2xl mb-5 text-sm">⚠️ {error}</div>
          )}
          <div className="space-y-4">
            {[
              { key:"name",     label:"👤 Nombre completo",      placeholder:"Tu nombre completo",  type:"text" },
              { key:"email",    label:"📧 Correo electrónico",   placeholder:"tu@email.com",        type:"email" },
              { key:"password", label:"🔒 Contraseña",           placeholder:"Mínimo 8 caracteres", type:"password" },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-600 text-gray-700 mb-2">{label}</label>
                <input type={type} placeholder={placeholder}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-mint-400 focus:bg-white transition font-body text-base"
                  value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>
          <button onClick={handle} disabled={loading}
            className="w-full gradient-mint text-white font-700 py-4 rounded-2xl mt-6 shadow-toy hover:shadow-hover transition-all hover:-translate-y-0.5 text-base disabled:opacity-60">
            {loading ? "Creando cuenta..." : "Crear Cuenta 🎉"}
          </button>
          <p className="text-center text-gray-400 text-sm mt-5">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-brand-500 font-700 hover:text-brand-600">Inicia sesión →</Link>
          </p>
        </div>

        {/* Beneficios */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[["🛡️","100% Seguro"],["🚀","Envío rápido"],["🧸","500+ juguetes"]].map(([e,t]) => (
            <div key={t} className="bg-white/70 backdrop-blur rounded-2xl p-3 text-center border border-white shadow-sm">
              <div className="text-2xl mb-1">{e}</div>
              <div className="text-xs text-gray-500 font-500">{t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
