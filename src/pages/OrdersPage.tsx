import { useEffect, useState } from "react";
import api from "../api/axios";
import MapView from "../components/MapView";

const statusConfig: Record<string, { label: string; color: string; icon: string; bg: string }> = {
  pending:   { label:"Pendiente",  color:"text-yellow-700", icon:"⏳", bg:"bg-yellow-50 border-yellow-200" },
  paid:      { label:"Pagado",     color:"text-blue-700",   icon:"💳", bg:"bg-blue-50 border-blue-200" },
  shipped:   { label:"Enviado",    color:"text-purple-700", icon:"🚚", bg:"bg-purple-50 border-purple-200" },
  delivered: { label:"Entregado",  color:"text-green-700",  icon:"✅", bg:"bg-green-50 border-green-200" },
  cancelled: { label:"Cancelado",  color:"text-red-700",    icon:"❌", bg:"bg-red-50 border-red-200" },
};

const steps = [
  { key:"pending",   icon:"🛒", label:"Pedido recibido",  desc:"Tu pedido fue registrado" },
  { key:"paid",      icon:"💳", label:"Pago confirmado",  desc:"Pago verificado" },
  { key:"shipped",   icon:"🚚", label:"En camino",        desc:"Tu paquete está en ruta" },
  { key:"delivered", icon:"🎉", label:"Entregado",        desc:"¡Disfruta tu juguete!" },
];

export default function OrdersPage() {
  const [orders, setOrders]               = useState<any[]>([]);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [lastUpdate, setLastUpdate]       = useState(new Date());

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const r = await api.get("/orders/my");
      setOrders(r.data);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-recarga cada 30 segundos
    const interval = setInterval(() => fetchOrders(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const getStepIndex = (status: string) => steps.findIndex(s => s.key === status);

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#eff6ff 0%,#dbeafe 30%,#fce7f3 70%,#ede9fe 100%)"}}>

      <div className="fixed top-20 right-10 w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-56 h-56 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative">
        {/* Header */}
        <div className="mt-6 mb-8 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 text-sky-600 px-4 py-1.5 rounded-full text-sm font-600 mb-3 shadow-sm">
              📦 Seguimiento de pedidos
            </div>
            <h1 className="font-display font-800 text-5xl text-gray-900">Mis <span className="text-gradient">Pedidos</span> 📦</h1>
            <p className="text-gray-500 mt-1 text-lg">Revisa el estado y seguimiento de tus compras</p>
          </div>
          {/* Botón actualizar */}
          <button onClick={() => fetchOrders(true)} disabled={refreshing}
            className="flex items-center gap-2 bg-white/90 border-2 border-sky-200 text-sky-600 font-600 px-4 py-2.5 rounded-2xl hover:bg-sky-50 transition shadow-card disabled:opacity-60 mt-2">
            <span className={refreshing ? "animate-spin" : ""}>🔄</span>
            {refreshing ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {/* Última actualización */}
        <p className="text-xs text-gray-400 mb-4 text-right">
          Última actualización: {lastUpdate.toLocaleTimeString("es-MX")} · Auto-actualiza cada 30s
        </p>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-40 gap-3">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
            <p className="text-gray-400 font-500">Cargando tus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-4xl p-16 shadow-hover border border-white text-center">
            <div className="text-8xl mb-4 float-1">📦</div>
            <p className="font-display font-700 text-2xl text-gray-400 mb-2">Aún no tienes pedidos</p>
            <p className="text-gray-400 mb-6">¡Explora nuestra tienda y encuentra el juguete perfecto!</p>
            <a href="/shop" className="gradient-brand text-white font-700 px-8 py-3.5 rounded-2xl shadow-toy hover:shadow-hover transition inline-block">
              Ir a la Tienda 🛍️
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((o: any) => {
              const s = statusConfig[o.status] || { label:o.status, color:"text-gray-600", icon:"📋", bg:"bg-gray-50 border-gray-200" };
              const stepIdx = getStepIndex(o.status);
              const isSelected = selectedOrder?.id === o.id;

              return (
                <div key={o.id} className="bg-white/90 backdrop-blur rounded-3xl shadow-card border-2 border-white overflow-hidden hover:shadow-hover transition-all">

                  {/* Header */}
                  <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md border ${s.bg}`}>
                        {s.icon}
                      </div>
                      <div>
                        <p className="font-display font-800 text-gray-900 text-lg">Pedido #{o.id}</p>
                        <p className="text-gray-400 text-sm">{new Date(o.created_at).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-display font-800 text-brand-500 text-2xl">${o.total?.toFixed(2)}</p>
                      <span className={`inline-flex items-center gap-1.5 text-sm font-600 px-3 py-1.5 rounded-full border ${s.bg} ${s.color}`}>
                        {s.icon} {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  {o.status !== "cancelled" && (
                    <div className="px-5 pb-4">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <p className="text-xs font-600 text-gray-500 uppercase tracking-wider mb-4">Estado del pedido</p>
                        <div className="relative flex items-start justify-between">
                          {/* Línea fondo */}
                          <div className="absolute top-6 left-6 right-6 h-1.5 bg-gray-200 rounded-full" />
                          {/* Línea progreso */}
                          <div className="absolute top-6 left-6 h-1.5 rounded-full transition-all duration-700"
                            style={{
                              width: stepIdx <= 0 ? "0%" : stepIdx === 1 ? "33%" : stepIdx === 2 ? "66%" : "calc(100% - 48px)",
                              background:"linear-gradient(135deg,#f97316,#f43f5e)"
                            }} />

                          {steps.map((step, i) => {
                            const done    = i <= stepIdx;
                            const current = i === stepIdx;
                            return (
                              <div key={step.key} className="relative flex flex-col items-center gap-2 z-10 flex-1">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm ${
                                  done ? "gradient-brand text-white shadow-toy" : "bg-white border-2 border-gray-200 text-gray-300"
                                } ${current ? "scale-110 ring-4 ring-brand-100" : ""}`}>
                                  {done ? step.icon : "○"}
                                </div>
                                <div className="text-center px-1">
                                  <p className={`text-xs font-700 ${done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                                  <p className={`text-xs mt-0.5 ${done ? "text-gray-500" : "text-gray-300"}`}>{step.desc}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Banner entregado */}
                  {o.status === "delivered" && (
                    <div className="mx-5 mb-4 bg-gradient-to-r from-green-50 to-mint-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-4">
                      <div className="text-4xl float-1">🎉</div>
                      <div>
                        <p className="font-display font-700 text-green-700 text-lg">¡Pedido entregado!</p>
                        <p className="text-green-600 text-sm">Tu pedido llegó con éxito. ¡Esperamos que los niños disfruten sus juguetes! 🧸</p>
                      </div>
                      <div className="ml-auto text-4xl float-2">🧸</div>
                    </div>
                  )}

                  {/* Banner cancelado */}
                  {o.status === "cancelled" && (
                    <div className="mx-5 mb-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
                      <div className="text-3xl">❌</div>
                      <div>
                        <p className="font-display font-700 text-red-700">Pedido cancelado</p>
                        <p className="text-red-500 text-sm">Este pedido fue cancelado. Contáctanos si tienes dudas.</p>
                      </div>
                    </div>
                  )}

                  {/* Mapa */}
                  {(o.status === "shipped" || o.status === "paid" || o.status === "delivered") && (
                    <div className="px-5 pb-5">
                      <button onClick={() => setSelectedOrder(isSelected ? null : o)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition font-600 text-sm ${
                          isSelected ? "gradient-brand text-white border-transparent shadow-toy" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-orange-50"
                        }`}>
                        <span className="flex items-center gap-2">🗺️ {isSelected ? "Ocultar mapa de seguimiento" : "Ver mapa de seguimiento"}</span>
                        <span>{isSelected ? "▲" : "▼"}</span>
                      </button>
                      {isSelected && (
                        <div className="mt-4">
                          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4 flex items-center gap-3">
                            <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center text-lg shadow-toy">🚚</div>
                            <div>
                              <p className="font-600 text-gray-800 text-sm">Seguimiento en tiempo real</p>
                              <p className="text-xs text-gray-500">{o.shipment?.address ? `📍 ${o.shipment.address}, ${o.shipment.city}` : "Dirección de entrega"}</p>
                              {o.shipment?.tracking_number && <p className="text-xs text-sky-500 font-600">🔍 Tracking: {o.shipment.tracking_number}</p>}
                            </div>
                          </div>
                          <MapView deliveryAddress={o.shipment?.address} deliveryCity={o.shipment?.city} showStore={true} />
                          <p className="text-xs text-gray-400 text-center mt-2">🧸 Naranja = ToyWorld · 📍 Rojo = Tu dirección</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
