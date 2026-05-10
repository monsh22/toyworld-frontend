import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

const CATEGORY_ICONS: Record<string, string> = {
  "Educativos":"🧩","Construcción":"🧱","Peluches":"🐻","Aire Libre":"🚴",
  "Arte":"🎨","Vehículos":"🚗","Muñecas":"🎀","Juegos de Mesa":"🎲",
  "Ciencia":"🔬","Deportes":"⚽","Música":"🎵","Robótica":"🤖",
};

export default function ShopPage() {
  const [products, setProducts]     = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [loading, setLoading]       = useState(true);
  const [searchParams]              = useSearchParams();

  useEffect(() => {
    Promise.all([api.get("/products/"), api.get("/categories/")]).then(([p, c]) => {
      setProducts(p.data);
      setCategories(c.data);
      // Si viene categoría en la URL, actívala
      const catParam = searchParams.get("categoria");
      if (catParam) {
        const found = c.data.find((cat: any) => cat.name === catParam);
        if (found) setActiveCategory(found.id);
      }
      setLoading(false);
    });
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === null || p.category_id === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(135deg,#fff7ed 0%,#fef3c7 30%,#fce7f3 70%,#ede9fe 100%)"}}>
      {/* Header colorido */}
      <div className="relative overflow-hidden px-6 pt-28 pb-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-20 right-[10%] text-4xl float-1 select-none">🧸</div>
        <div className="absolute top-16 left-[5%] text-3xl float-2 select-none">⭐</div>
        <div className="absolute bottom-4 right-[20%] text-3xl float-3 select-none">🎀</div>
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 text-brand-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">
            🛍️ Todo para tus pequeños
          </div>
          <h1 className="font-display font-800 text-5xl text-gray-900 mb-2">
            Nuestra <span className="text-gradient">Tienda</span> 🛍️
          </h1>
          <p className="text-gray-500 text-lg mb-6">Juguetes seguros y certificados para cada etapa</p>
          <div className="relative max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              className="w-full pl-10 pr-4 py-3.5 bg-white/90 backdrop-blur rounded-2xl border border-white focus:outline-none focus:border-brand-400 focus:bg-white transition font-body shadow-card"
              placeholder="Buscar juguetes..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-2">
          <button onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-600 whitespace-nowrap transition-all flex-shrink-0 shadow-sm ${
              activeCategory === null ? "gradient-brand text-white shadow-toy" : "bg-white/80 text-gray-600 hover:bg-white border border-white"
            }`}>
            🧸 Todos
          </button>
          {categories.map((c: any) => (
            <button key={c.id} onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-600 whitespace-nowrap transition-all flex-shrink-0 shadow-sm ${
                activeCategory === c.id ? "gradient-brand text-white shadow-toy" : "bg-white/80 text-gray-600 hover:bg-white border border-white"
              }`}>
              {CATEGORY_ICONS[c.name] || "🎯"} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div className="max-w-6xl mx-auto px-6 py-6 pb-16">
        {activeCategory && (
          <div className="mb-6 flex items-center gap-3 bg-white/80 backdrop-blur rounded-2xl p-4 border border-white shadow-card">
            <div className="gradient-brand w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-toy">
              {CATEGORY_ICONS[categories.find(c => c.id === activeCategory)?.name] || "🎯"}
            </div>
            <div>
              <p className="font-display font-700 text-gray-900">{categories.find(c => c.id === activeCategory)?.name}</p>
              <p className="text-xs text-gray-400">{filtered.length} producto{filtered.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setActiveCategory(null)}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600 bg-gray-100 px-3 py-1.5 rounded-xl transition">
              ✕ Quitar filtro
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/60 backdrop-blur rounded-3xl border border-white">
            <div className="text-6xl mb-4">🧸</div>
            <p className="text-gray-400 text-xl font-display">No hay productos en esta categoría</p>
            <button onClick={() => { setActiveCategory(null); setSearch(""); }}
              className="mt-4 gradient-brand text-white font-600 px-6 py-2.5 rounded-2xl shadow-toy hover:shadow-hover transition">
              Ver todos los productos
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
