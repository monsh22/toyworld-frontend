import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../api/axios";

type Tab = "products" | "orders" | "shipments" | "categories" | "users";

const tabs: { key: Tab; label: string; icon: string; desc: string }[] = [
  { key: "products",   label: "Productos",  icon: "🧸", desc: "Agrega, edita o elimina productos del catálogo" },
  { key: "orders",     label: "Pedidos",    icon: "📦", desc: "Revisa y actualiza el estado de cada orden" },
  { key: "shipments",  label: "Envíos",     icon: "🚚", desc: "Controla el seguimiento y estado de los envíos" },
  { key: "categories", label: "Categorías", icon: "🏷️", desc: "Gestiona las categorías de productos" },
  { key: "users",      label: "Clientes",   icon: "👥", desc: "Consulta los clientes registrados en la plataforma" },
];

const tabColors: Record<Tab, string> = {
  products:   "from-brand-400 to-brand-600",
  orders:     "from-mint-400 to-sky-400",
  shipments:  "from-lemon-400 to-brand-500",
  categories: "from-purple-400 to-rose-400",
  users:      "from-sky-400 to-indigo-400",
};

const sectionBg: Record<Tab, string> = {
  products:   "linear-gradient(135deg,#fff7ed 0%,#ffedd5 100%)",
  orders:     "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)",
  shipments:  "linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)",
  categories: "linear-gradient(135deg,#faf5ff 0%,#ede9fe 100%)",
  users:      "linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)",
};

const statusColors: Record<string,string> = {
  pending:"bg-yellow-100 text-yellow-700", paid:"bg-blue-100 text-blue-700",
  shipped:"bg-purple-100 text-purple-700", delivered:"bg-green-100 text-green-700",
  cancelled:"bg-red-100 text-red-700", preparing:"bg-orange-100 text-orange-700",
  in_transit:"bg-indigo-100 text-indigo-700",
};

const CATEGORY_ICONS: Record<string,string> = {
  "Educativos":"🧩","Construcción":"🧱","Peluches":"🐻","Aire Libre":"🚴",
  "Arte":"🎨","Vehículos":"🚗","Muñecas":"🎀","Juegos de Mesa":"🎲",
  "Ciencia":"🔬","Deportes":"⚽","Música":"🎵","Robótica":"🤖",
};

const emptyProduct = { name:"", price:0, stock:0, min_age:0, max_age:12, description:"", is_safe_certified:true, safety_notes:"", image_url:"", category_id: null as number | null };

const formFields = [
  { k:"name",        label:"Nombre del producto *",    hint:"Ej: LEGO City 60301",          t:"text" },
  { k:"price",       label:"Precio (MXN) *",           hint:"Ej: 299.99",                   t:"number" },
  { k:"stock",       label:"Unidades disponibles *",   hint:"Ej: 50",                       t:"number" },
  { k:"min_age",     label:"Edad mínima recomendada",  hint:"Ej: 3 (años)",                 t:"number" },
  { k:"max_age",     label:"Edad máxima recomendada",  hint:"Ej: 12 (años)",                t:"number" },
  { k:"image_url",   label:"URL de la imagen",         hint:"https://...",                  t:"text" },
  { k:"description", label:"Descripción del producto", hint:"Material, piezas, colores...", t:"text" },
  { k:"safety_notes",label:"Notas de seguridad",       hint:"Ej: No apto para <3 años",     t:"text" },
];

export default function AdminDashboard() {
  const { isAdmin, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => { if (!token || !isAdmin) navigate("/login"); }, [token, isAdmin]);

  const [tab, setTab]               = useState<Tab>("products");
  const [data, setData]             = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading]       = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [product, setProduct]       = useState({ ...emptyProduct });
  const [saveMsg, setSaveMsg]       = useState("");
  const [saveError, setSaveError]   = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catMsg, setCatMsg]         = useState("");
  const [showCatForm, setShowCatForm] = useState(false);

  const endpoints: Record<Tab,string> = {
    products:"/products/", orders:"/orders/", shipments:"/shipments/",
    categories:"/categories/", users:"/admin/users",
  };

  const loadCategories = () => api.get("/categories/").then(r => setCategories(r.data));

  const load = () => {
    setLoading(true);
    api.get(endpoints[tab]).then(r => { setData(r.data); setLoading(false); });
  };

  useEffect(() => { if (token && isAdmin) { load(); loadCategories(); } }, [tab]);

  const openNew = () => { setEditingId(null); setProduct({...emptyProduct}); setShowForm(true); setSaveMsg(""); setSaveError(""); };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setProduct({ name:p.name||"", price:p.price||0, stock:p.stock||0, min_age:p.min_age||0,
      max_age:p.max_age||12, description:p.description||"", is_safe_certified:p.is_safe_certified??true,
      safety_notes:p.safety_notes||"", image_url:p.image_url||"", category_id:p.category_id||null });
    setShowForm(true); setSaveMsg(""); setSaveError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveProduct = async () => {
    setSaveMsg(""); setSaveError("");
    try {
      if (editingId) { await api.put(`/products/${editingId}`, product); setSaveMsg("✅ Producto actualizado"); }
      else { await api.post("/products/", product); setSaveMsg("✅ Producto guardado"); }
      setShowForm(false); setEditingId(null); setProduct({...emptyProduct}); load();
    } catch (err: any) { setSaveError("❌ " + (err?.response?.data?.detail || "Error al guardar")); }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("¿Eliminar este producto?")) { await api.delete(`/products/${id}`); load(); }
  };

  const saveCategory = async () => {
    if (!newCatName.trim()) { setCatMsg("❌ El nombre es obligatorio"); return; }
    try {
      await api.post("/categories/", { name: newCatName, description: newCatDesc });
      setCatMsg("✅ Categoría creada"); setNewCatName(""); setNewCatDesc(""); setShowCatForm(false);
      loadCategories(); load();
    } catch { setCatMsg("❌ Error al crear"); }
  };

  const deleteCategory = async (id: number) => {
    if (confirm("¿Eliminar esta categoría?")) { await api.delete(`/categories/${id}`); loadCategories(); load(); }
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await api.put(`/orders/${id}/status?status=${status}`); load();
  };

  const updateShipment = async (id: number, status: string) => {
    await api.put(`/shipments/${id}`, { status }); load();
  };

  if (!token || !isAdmin) return null;
  const currentTab = tabs.find(t => t.key === tab)!;

  return (
    <div className="min-h-screen pt-20 pb-16" style={{background:"linear-gradient(135deg,#fff7ed 0%,#fef3c7 30%,#fce7f3 70%,#ede9fe 100%)"}}>

      {/* Blobs decorativos */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="fixed bottom-20 left-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">

        {/* Header */}
        <div className="mt-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 text-brand-600 px-4 py-1.5 rounded-full text-sm font-600 mb-3 shadow-sm">
              ⚙️ Panel de control
            </div>
            <h1 className="font-display font-800 text-5xl text-gray-900">Panel de <span className="text-gradient">Administración</span></h1>
            <p className="text-gray-500 mt-1 text-lg">Gestiona tu tienda ToyWorld desde aquí</p>
          </div>
          <div className="flex items-center gap-2 bg-white/90 border border-green-200 rounded-2xl px-5 py-3 shadow-card backdrop-blur">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-600 text-gray-700">Admin activo</span>
          </div>
        </div>

        {saveMsg && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl font-600 shadow-sm">{saveMsg}</div>}
        {saveError && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl font-600 text-sm shadow-sm">{saveError}</div>}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {tabs.map(s => (
            <div key={s.key} onClick={() => setTab(s.key)}
              className={`rounded-3xl p-5 cursor-pointer transition-all shadow-card border-2 ${
                tab===s.key
                  ? "bg-white border-brand-300 ring-4 ring-brand-100 scale-105"
                  : "bg-white/80 backdrop-blur border-white hover:border-gray-200 hover:scale-102"
              }`}>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tabColors[s.key]} flex items-center justify-center text-xl mb-3 shadow-md`}>{s.icon}</div>
              <div className="font-display font-800 text-3xl text-gray-900">{tab===s.key?data.length:"—"}</div>
              <div className="text-sm text-gray-400 font-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Panel principal */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-hover border border-white overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-600 whitespace-nowrap transition-all ${
                  tab===t.key
                    ? "text-brand-600 bg-gradient-to-b from-orange-50 to-white border-b-2 border-brand-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}>
                <span className="text-base">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Section header con color */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-50" style={{background: sectionBg[tab]}}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tabColors[tab]} flex items-center justify-center text-2xl shadow-md`}>
                {currentTab.icon}
              </div>
              <div>
                <h2 className="font-display font-800 text-2xl text-gray-900">{currentTab.label}</h2>
                <p className="text-sm text-gray-500">{currentTab.desc}</p>
              </div>
            </div>
          </div>

          <div className="p-6">

            {/* PRODUCTS */}
            {tab === "products" && (
              <>
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <p className="font-600 text-gray-800 text-sm">Gestión de Productos</p>
                    <p className="text-gray-500 text-xs mt-0.5">Agrega nuevos productos o haz clic en <strong>"Editar"</strong> para modificar uno existente.</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-display font-700 text-gray-900">Catálogo de Productos</p>
                    <p className="text-xs text-gray-400">{data.length} producto{data.length!==1?"s":""} registrado{data.length!==1?"s":""}</p>
                  </div>
                  <button onClick={openNew} className="gradient-brand text-white text-sm font-600 px-5 py-2.5 rounded-xl shadow-toy hover:shadow-hover transition hover:-translate-y-0.5">
                    + Nuevo Producto
                  </button>
                </div>
                {showForm && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-display font-700 text-gray-900">{editingId ? `✏️ Editando producto #${editingId}` : "➕ Nuevo Producto"}</p>
                        <p className="text-xs text-gray-400">Los campos con * son obligatorios</p>
                      </div>
                      <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formFields.map(({ k, label, hint, t }) => (
                        <div key={k} className="flex flex-col gap-1">
                          <label className="text-xs font-600 text-gray-600">{label}</label>
                          <input type={t} placeholder={hint}
                            className="px-3 py-2.5 bg-white border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition placeholder:text-gray-300"
                            value={(product as any)[k]}
                            onChange={e => setProduct({ ...product, [k]: t==="number" ? Number(e.target.value) : e.target.value })} />
                        </div>
                      ))}
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-600 text-gray-600">Categoría del producto</label>
                        <select className="px-3 py-2.5 bg-white border border-orange-200 rounded-xl text-sm focus:outline-none focus:border-brand-400 transition"
                          value={product.category_id ?? ""}
                          onChange={e => setProduct({ ...product, category_id: e.target.value ? Number(e.target.value) : null })}>
                          <option value="">-- Sin categoría --</option>
                          {categories.map((c: any) => <option key={c.id} value={c.id}>{CATEGORY_ICONS[c.name]||"🎯"} {c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 p-3 bg-white border border-orange-200 rounded-xl w-fit">
                      <input type="checkbox" id="certified" checked={product.is_safe_certified}
                        onChange={e => setProduct({ ...product, is_safe_certified: e.target.checked })} className="w-4 h-4 accent-brand-500" />
                      <label htmlFor="certified" className="text-sm font-500 text-gray-700">Este producto tiene certificación de seguridad infantil</label>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={saveProduct} className="gradient-brand text-white font-700 px-6 py-2.5 rounded-xl shadow-toy hover:shadow-hover transition hover:-translate-y-0.5">
                        {editingId ? "💾 Guardar cambios" : "✓ Guardar Producto"}
                      </button>
                      <button onClick={() => { setShowForm(false); setEditingId(null); }} className="bg-gray-100 text-gray-600 font-600 px-6 py-2.5 rounded-xl hover:bg-gray-200 transition">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" /></div>
                ) : data.length === 0 ? (
                  <div className="text-center py-16 bg-orange-50 rounded-2xl">
                    <div className="text-5xl mb-3">🧸</div>
                    <p className="font-display font-600 text-gray-500">Aún no hay productos</p>
                    <p className="text-sm text-gray-400">Haz clic en "+ Nuevo Producto" para agregar el primero</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((p: any) => {
                      const cat = categories.find((c: any) => c.id === p.category_id);
                      return (
                        <div key={p.id} className={`border-2 rounded-2xl p-4 transition group bg-white hover:shadow-card ${editingId===p.id?"border-brand-400 ring-2 ring-brand-100":"border-gray-100 hover:border-brand-200"}`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl overflow-hidden border border-orange-100">
                              {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover rounded-xl" /> : "🧸"}
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                              <button onClick={() => openEdit(p)} className="text-brand-500 hover:text-brand-700 text-xs px-2 py-1 rounded-lg hover:bg-brand-50 font-600">✏️ Editar</button>
                              <button onClick={() => deleteProduct(p.id)} className="text-rose-400 hover:text-rose-600 text-xs px-2 py-1 rounded-lg hover:bg-rose-50">🗑️</button>
                            </div>
                          </div>
                          <p className="font-display font-700 text-gray-900">{p.name}</p>
                          {p.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="font-display font-800 text-brand-500 text-lg">${p.price}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">Stock: {p.stock}</span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-sky-500">🎂 {p.min_age}-{p.max_age} años</span>
                          </div>
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {p.is_safe_certified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Certificado</span>}
                            {cat && <span className="text-xs bg-orange-100 text-brand-600 px-2 py-0.5 rounded-full">🏷️ {cat.name}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <>
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-600 text-gray-800 text-sm">Gestión de Pedidos</p>
                    <p className="text-gray-500 text-xs mt-0.5">Cambia el estado: <strong>pending → paid → shipped → delivered</strong>.</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin" /></div>
                ) : data.length === 0 ? (
                  <div className="text-center py-16 bg-green-50 rounded-2xl">
                    <div className="text-5xl mb-3">📦</div>
                    <p className="font-display font-600 text-gray-500">Aún no hay pedidos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.map((o: any) => (
                      <div key={o.id} className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-mint-200 hover:shadow-card transition group">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 gradient-mint rounded-xl flex items-center justify-center shadow-sm text-xl">📦</div>
                          <div>
                            <p className="font-display font-700 text-gray-900">Pedido #{o.id}</p>
                            <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display font-800 text-brand-500 text-lg">${o.total?.toFixed(2)}</span>
                          <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}
                            className={`text-xs font-600 px-3 py-1.5 rounded-xl border-0 focus:outline-none cursor-pointer ${statusColors[o.status]||"bg-gray-100 text-gray-600"}`}>
                            {["pending","paid","shipped","delivered","cancelled"].map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SHIPMENTS */}
            {tab === "shipments" && (
              <>
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-2xl">🗺️</span>
                  <div>
                    <p className="font-600 text-gray-800 text-sm">Control de Envíos</p>
                    <p className="text-gray-500 text-xs mt-0.5">Actualiza: <strong>preparing → in_transit → delivered</strong>.</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-lemon-200 border-t-lemon-400 rounded-full animate-spin" /></div>
                ) : data.length === 0 ? (
                  <div className="text-center py-16 bg-yellow-50 rounded-2xl">
                    <div className="text-5xl mb-3">🚚</div>
                    <p className="font-display font-600 text-gray-500">Aún no hay envíos</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.map((s: any) => (
                      <div key={s.id} className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-yellow-200 hover:shadow-card transition">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 gradient-lemon rounded-xl flex items-center justify-center text-xl shadow-sm">🚚</div>
                            <div>
                              <p className="font-display font-700 text-gray-900">Envío #{s.id} — Pedido #{s.order_id}</p>
                              <p className="text-xs text-gray-400">📍 {s.address}, {s.city}</p>
                              {s.tracking_number && <p className="text-xs text-sky-500">🔍 Tracking: {s.tracking_number}</p>}
                            </div>
                          </div>
                          <select value={s.status} onChange={e => updateShipment(s.id, e.target.value)}
                            className={`text-xs font-600 px-3 py-1.5 rounded-xl border-0 focus:outline-none cursor-pointer ${statusColors[s.status]||"bg-gray-100 text-gray-600"}`}>
                            {["preparing","in_transit","delivered"].map(st=><option key={st} value={st}>{st}</option>)}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* CATEGORIES */}
            {tab === "categories" && (
              <>
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-2xl">🏷️</span>
                  <div>
                    <p className="font-600 text-gray-800 text-sm">Gestión de Categorías</p>
                    <p className="text-gray-500 text-xs mt-0.5">Las categorías aparecen en la landing y en el filtro de la tienda.</p>
                  </div>
                </div>
                {catMsg && (
                  <div className={`mb-4 px-4 py-3 rounded-2xl font-600 text-sm ${catMsg.includes("✅")?"bg-green-50 border border-green-200 text-green-700":"bg-red-50 border border-red-200 text-red-700"}`}>
                    {catMsg}
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-display font-700 text-gray-900">Categorías</p>
                    <p className="text-xs text-gray-400">{categories.length} categoría{categories.length!==1?"s":""} registrada{categories.length!==1?"s":""}</p>
                  </div>
                  <button onClick={() => { setShowCatForm(!showCatForm); setCatMsg(""); }}
                    className="text-white text-sm font-600 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition hover:-translate-y-0.5"
                    style={{background:"linear-gradient(135deg,#a855f7,#f43f5e)"}}>
                    {showCatForm ? "✕ Cancelar" : "+ Nueva Categoría"}
                  </button>
                </div>
                {showCatForm && (
                  <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6">
                    <p className="font-display font-700 text-gray-900 mb-4">➕ Nueva Categoría</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-600 text-gray-600">Nombre *</label>
                        <input placeholder="Ej: Muñecas, Robótica..."
                          className="px-3 py-2.5 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition"
                          value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-600 text-gray-600">Descripción (opcional)</label>
                        <input placeholder="Ej: Muñecas y accesorios"
                          className="px-3 py-2.5 bg-white border border-purple-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 transition"
                          value={newCatDesc} onChange={e => setNewCatDesc(e.target.value)} />
                      </div>
                    </div>
                    <button onClick={saveCategory}
                      className="mt-4 text-white font-700 px-6 py-2.5 rounded-xl transition hover:-translate-y-0.5 shadow-sm"
                      style={{background:"linear-gradient(135deg,#a855f7,#f43f5e)"}}>
                      Guardar Categoría ✓
                    </button>
                  </div>
                )}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c: any) => (
                    <div key={c.id} className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-purple-200 hover:shadow-card transition group">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0"
                        style={{background:"linear-gradient(135deg,#a855f7,#f43f5e)"}}>
                        {CATEGORY_ICONS[c.name] || "🎯"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-700 text-gray-900">{c.name}</p>
                        {c.description && <p className="text-xs text-gray-400 truncate">{c.description}</p>}
                      </div>
                      <button onClick={() => deleteCategory(c.id)}
                        className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition text-xs px-2 py-1 rounded-lg hover:bg-rose-50">
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* USERS */}
            {tab === "users" && (
              <>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5 flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-600 text-gray-800 text-sm">Clientes Registrados</p>
                    <p className="text-gray-500 text-xs mt-0.5">Los usuarios con corona 👑 tienen permisos de administrador.</p>
                  </div>
                </div>
                {loading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3">
                    {data.map((u: any) => (
                      <div key={u.id} className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center gap-3 hover:border-sky-200 hover:shadow-card transition">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${u.is_admin?"gradient-brand shadow-toy":"bg-gray-100"}`}>
                          {u.is_admin?"👑":"👤"}
                        </div>
                        <div>
                          <p className="font-display font-700 text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                        {u.is_admin && <span className="ml-auto text-xs bg-brand-100 text-brand-600 px-3 py-1 rounded-full font-600">👑 Admin</span>}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
