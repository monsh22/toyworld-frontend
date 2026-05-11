import { useState } from "react";
import { useCartStore } from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuthStore } from "../store/authStore";
import FakePayment from "../components/FakePayment";

export default function CartPage() {
  const { items, remove, clear, total } = useCartStore();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm]           = useState({ address:"", city:"", state:"", zip_code:"" });
  const [msg, setMsg]             = useState("");
  const [success, setSuccess]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleCheckout = () => {
    if (!token) { navigate("/login"); return; }
    if (!form.address || !form.city) { setMsg("Por favor llena todos los campos de envío"); return; }
    setMsg("");
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setLoading(true);
    try {
      await api.post("/orders/", { items: items.map(i => ({ product_id:i.id, quantity:i.quantity })), ...form });
      clear(); setSuccess(true);
    } catch { setMsg("Error al procesar el pedido."); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#ecfdf5 0%,#d1fae5 30%,#fce7f3 70%,#ede9fe 100%)"}}>
      <div className="fixed top-20 right-10 w-72 h-72 bg-mint-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="relative bg-white/90 backdrop-blur rounded-4xl p-12 shadow-hover border border-white text-center max-w-lg w-full z-10">
        <div className="absolute top-6 left-8 text-3xl float-1 select-none">🎊</div>
        <div className="absolute top-6 right-8 text-3xl float-2 select-none">🎉</div>
        <div className="text-8xl mb-5 float-1">🎉</div>
        <h2 className="font-display font-800 text-4xl text-gray-900 mb-3">¡Pedido realizado!</h2>
        <p className="text-gray-500 text-lg mb-2">Tu pedido está siendo procesado.</p>
        <p className="text-gray-400 mb-8">Te notificaremos sobre el estado de tu envío. 📦</p>
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          <p className="text-xs font-600 text-gray-500 uppercase tracking-wider mb-4">¿Qué sigue?</p>
          <div className="space-y-3">
            {[
              { icon:"✅", text:"Pedido recibido", done:true },
              { icon:"💳", text:"Pago confirmado", done:true },
              { icon:"📦", text:"Preparando paquete", done:false },
              { icon:"🚚", text:"Enviando a tu puerta", done:false },
              { icon:"🎉", text:"¡Entrega en 3-5 días!", done:false },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm ${s.done ? "text-green-600 font-600" : "text-gray-400"}`}>
                <span className="text-lg">{s.icon}</span>
                <span>{s.text}</span>
                {s.done && <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-600">✓ Listo</span>}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/orders")}
            className="gradient-brand text-white font-700 px-8 py-3.5 rounded-2xl shadow-toy hover:shadow-hover transition hover:-translate-y-0.5">
            Ver mis pedidos 📦
          </button>
          <button onClick={() => navigate("/shop")}
            className="bg-gray-100 text-gray-700 font-600 px-6 py-3.5 rounded-2xl hover:bg-gray-200 transition">
            Seguir comprando 🛍️
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#fff7ed 0%,#fef3c7 30%,#fce7f3 70%,#ede9fe 100%)"}}>
      <div className="fixed top-20 right-10 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-56 h-56 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      {showPayment && (
        <FakePayment
          total={total()}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-6 relative">
        <div className="mt-6 mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 text-brand-600 px-4 py-1.5 rounded-full text-sm font-600 mb-3 shadow-sm">🛒 Tu selección</div>
          <h1 className="font-display font-800 text-5xl text-gray-900">Tu <span className="text-gradient">Carrito</span> 🛒</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-4xl p-16 shadow-hover border border-white text-center">
            <div className="text-8xl mb-4 float-1">🛒</div>
            <p className="font-display font-700 text-2xl text-gray-400 mb-2">Tu carrito está vacío</p>
            <p className="text-gray-400 mb-6">¡Agrega juguetes increíbles desde nuestra tienda!</p>
            <button onClick={() => navigate("/shop")}
              className="gradient-brand text-white font-700 px-8 py-3.5 rounded-2xl shadow-toy hover:shadow-hover transition">
              Ir a la Tienda 🛍️
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-3">
              <p className="font-display font-700 text-gray-900 mb-2">{items.length} producto{items.length!==1?"s":""} en tu carrito</p>
              {items.map(i => (
                <div key={i.id} className="bg-white/90 backdrop-blur rounded-3xl p-4 shadow-card border-2 border-white flex items-center gap-4 hover:shadow-hover transition">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 border border-orange-100 overflow-hidden">
                    {i.image_url ? <img src={i.image_url} alt={i.name} className="w-full h-full object-cover rounded-2xl" /> : "🧸"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-700 text-gray-900 truncate text-lg">{i.name}</p>
                    <p className="text-gray-400 text-sm">Cantidad: {i.quantity}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-display font-800 text-brand-500 text-xl">${(i.price * i.quantity).toFixed(2)}</p>
                    <p className="text-gray-400 text-xs">${i.price} c/u</p>
                    <button onClick={() => remove(i.id)} className="text-xs text-rose-400 hover:text-rose-600 transition mt-1 hover:underline">✕ Eliminar</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-hover border-2 border-white sticky top-24">
                <h2 className="font-display font-700 text-xl text-gray-900 mb-1">Datos de Envío 📦</h2>
                <p className="text-xs text-gray-400 mb-4">¿A dónde enviamos tu pedido?</p>
                <div className="space-y-3">
                  {[
                    { k:"address",  p:"📍 Calle y número" },
                    { k:"city",     p:"🏙️ Ciudad" },
                    { k:"state",    p:"🗺️ Estado" },
                    { k:"zip_code", p:"📮 Código Postal" },
                  ].map(({ k, p }) => (
                    <input key={k} placeholder={p}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 focus:bg-white text-sm transition font-body"
                      value={(form as any)[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                  ))}
                </div>
                {msg && <p className="text-rose-500 text-sm mt-2 font-500">⚠️ {msg}</p>}
                <div className="border-t border-gray-100 mt-5 pt-5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-500">Total a pagar</span>
                    <span className="font-display font-800 text-3xl text-brand-500">${total().toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={loading}
                    className="w-full gradient-brand text-white font-700 py-4 rounded-2xl shadow-toy hover:shadow-hover transition-all hover:-translate-y-0.5 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                    <span>💳</span>
                    {loading ? "Procesando..." : "Proceder al pago"}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-3">🔒 Pago seguro y encriptado</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
