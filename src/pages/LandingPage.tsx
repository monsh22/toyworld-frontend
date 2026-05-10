import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MapView from "../components/MapView";
import api from "../api/axios";

const CATEGORY_ICONS: Record<string, string> = {
  "Educativos":"🧩","Construcción":"🧱","Peluches":"🐻","Aire Libre":"🚴",
  "Arte":"🎨","Vehículos":"🚗","Muñecas":"🎀","Juegos de Mesa":"🎲",
  "Ciencia":"🔬","Deportes":"⚽","Música":"🎵","Robótica":"🤖",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Educativos":"from-sky-400 to-mint-400","Construcción":"from-brand-400 to-brand-600",
  "Peluches":"from-rose-400 to-brand-400","Aire Libre":"from-mint-400 to-sky-500",
  "Arte":"from-lemon-400 to-brand-500","Vehículos":"from-brand-500 to-rose-500",
  "Muñecas":"from-pink-400 to-rose-500","Juegos de Mesa":"from-purple-400 to-indigo-500",
  "Ciencia":"from-sky-500 to-indigo-400","Deportes":"from-mint-500 to-sky-400",
  "Música":"from-lemon-400 to-mint-400","Robótica":"from-indigo-400 to-purple-500",
};

const features = [
  { icon:"🛡️", title:"Seguridad Certificada", desc:"Todos cumplen normas internacionales de seguridad infantil.", bg:"from-mint-400 to-sky-400" },
  { icon:"🎂", title:"Control de Edad",        desc:"Filtra por rango etario recomendado para cada niño.",        bg:"from-sky-400 to-indigo-400" },
  { icon:"🚀", title:"Envíos Rápidos",         desc:"Seguimiento en tiempo real hasta tu puerta en 3-5 días.",    bg:"from-brand-400 to-brand-600" },
  { icon:"💳", title:"Pago Seguro",            desc:"Tus datos siempre protegidos con encriptación total.",       bg:"from-rose-400 to-brand-500" },
];

const testimonials = [
  { name:"Sofía M.", role:"Mamá de 2 hijos", text:"Los juguetes llegaron súper rápido y bien empaquetados. Mi hijo de 4 años está feliz con su set de construcción.", avatar:"👩", stars:5, color:"from-brand-400 to-rose-400" },
  { name:"Carlos R.", role:"Papá primerizo",  text:"Me encanta que puedo filtrar por edad. Encontré el regalo perfecto para el cumpleaños de mi hija de 3 años.", avatar:"👨", stars:5, color:"from-mint-400 to-sky-400" },
  { name:"Ana L.",    role:"Abuelita feliz",  text:"El chatbot Toby me ayudó a elegir un juguete educativo. ¡Excelente servicio y calidad certificada!", avatar:"👵", stars:5, color:"from-purple-400 to-brand-400" },
];

const steps = [
  { n:1, icon:"🔍", title:"Explora",   desc:"Filtra por edad o categoría.",    color:"from-brand-400 to-brand-600" },
  { n:2, icon:"🛒", title:"Agrega",    desc:"Selecciona y agrega al carrito.", color:"from-rose-400 to-brand-400" },
  { n:3, icon:"📦", title:"Confirma",  desc:"Ingresa tu dirección.",           color:"from-mint-400 to-sky-400" },
  { n:4, icon:"🎉", title:"¡Recibe!",  desc:"En 3-5 días hábiles.",            color:"from-lemon-400 to-brand-500" },
];

export default function LandingPage() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => { api.get("/categories/").then(r => setCategories(r.data)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{background:"linear-gradient(135deg,#fff7ed 0%,#fef3c7 25%,#fce7f3 60%,#ede9fe 100%)"}}>
        <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-brand-200 to-rose-200 blob opacity-40 blur-2xl float-1" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-sky-200 blob-2 opacity-30 blur-3xl float-2" />
        <div className="absolute top-24 right-[10%] text-5xl float-1 select-none">🎠</div>
        <div className="absolute top-40 left-[5%] text-4xl float-2 select-none">⭐</div>
        <div className="absolute bottom-32 left-[12%] text-5xl float-3 select-none">🎪</div>
        <div className="absolute bottom-20 right-[15%] text-4xl float-1 select-none">🌈</div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-brand-200 text-brand-600 px-5 py-2 rounded-full text-sm font-600 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></span>
              ✨ Más de 500 juguetes certificados
            </div>
            <h1 className="font-display font-800 leading-tight mb-6">
              <span className="text-6xl md:text-8xl text-gray-900 block">El mejor</span>
              <span className="text-6xl md:text-8xl block text-gradient">mundo de</span>
              <span className="text-6xl md:text-8xl text-gray-900 block">juguetes</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Descubre juguetes <strong className="text-brand-500">certificados</strong> y <strong className="text-brand-500">seguros</strong>, organizados por edad y pensados para el desarrollo infantil. 🧸
            </p>
            <div className="flex gap-4 justify-center lg:justify-start flex-wrap mb-12">
              <Link to="/shop" className="gradient-brand text-white font-700 px-10 py-4 rounded-2xl shadow-toy hover:shadow-hover transition-all hover:-translate-y-1 text-lg flex items-center gap-2">
                Explorar Tienda <span className="text-xl">🛍️</span>
              </Link>
              <Link to="/register" className="bg-white text-gray-700 font-600 px-10 py-4 rounded-2xl border-2 border-gray-200 hover:border-brand-400 hover:text-brand-600 transition-all text-lg shadow-card hover:-translate-y-1">
                Crear Cuenta 🎉
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto lg:mx-0">
              {[["500+","Productos","🧸"],["100%","Seguros","🛡️"],["24h","Soporte","💬"],["3-5d","Envío","🚀"]].map(([n,l,e]) => (
                <div key={l} className="bg-white/80 backdrop-blur rounded-2xl p-3 text-center shadow-card border border-white">
                  <div className="text-xl mb-1">{e}</div>
                  <div className="font-display font-800 text-lg text-brand-600">{n}</div>
                  <div className="text-xs text-gray-400 font-500">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 gradient-brand rounded-full opacity-10 animate-pulse scale-110" />
              <div className="absolute inset-4 bg-gradient-to-br from-brand-100 to-rose-100 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[160px] drop-shadow-2xl float-1">🧸</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-white shadow-hover rounded-2xl px-4 py-3 flex items-center gap-2 float-1">
                <span className="text-2xl">🛡️</span>
                <div><p className="text-xs font-700 text-gray-900">Certificado</p><p className="text-xs text-mint-500 font-600">100% Seguro</p></div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white shadow-hover rounded-2xl px-4 py-3 flex items-center gap-2 float-2">
                <span className="text-2xl">🎂</span>
                <div><p className="text-xs font-700 text-gray-900">0–12 años</p><p className="text-xs text-brand-500 font-600">Edad ideal</p></div>
              </div>
              <div className="absolute top-1/2 -right-10 bg-white shadow-hover rounded-2xl px-4 py-3 flex items-center gap-2 float-3">
                <span className="text-2xl">⭐</span>
                <div><p className="text-xs font-700 text-gray-900">4.9/5</p><p className="text-xs text-lemon-400 font-600">★★★★★</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f97316" fillOpacity="0.15"/>
          </svg>
        </div>
      </section>

      {/* ═══ CATEGORÍAS — fondo naranja suave ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#fff7ed 0%,#ffedd5 50%,#fed7aa 100%)"}}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-200 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/80 text-brand-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">🏷️ Explora por categoría</div>
            <h2 className="font-display font-800 text-5xl text-gray-900 mb-3">Categorías <span className="text-gradient">Populares</span></h2>
            <p className="text-gray-600 text-lg">Encuentra el juguete perfecto según los intereses de tu hijo</p>
          </div>
          {categories.length === 0 ? (
            <div className="flex justify-center py-8"><div className="w-8 h-8 border-4 border-brand-300 border-t-brand-600 rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {categories.map((c: any) => (
                <Link to={`/shop?categoria=${encodeURIComponent(c.name)}`} key={c.id} className="group bg-white rounded-3xl p-6 text-center card-hover shadow-card border border-white overflow-hidden">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[c.name]||"from-brand-400 to-brand-600"} flex items-center justify-center text-3xl mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    {CATEGORY_ICONS[c.name] || "🎯"}
                  </div>
                  <div className="font-display font-700 text-sm text-gray-900 mb-1">{c.name}</div>
                  <div className="text-xs text-gray-400 line-clamp-1">{c.description}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ BANNER COLORIDO ═══ */}
      <section className="py-16 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#f97316,#f43f5e,#a855f7)"}}>
        <div className="absolute inset-0 opacity-10 flex items-center justify-around text-9xl select-none">
          <span>🧸</span><span>🎯</span><span>🎪</span><span>🎨</span><span>🚀</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h2 className="font-display font-800 text-4xl md:text-5xl mb-4">¡Juguetes que hacen <span className="text-lemon-300">sonreír</span>! 😄</h2>
          <p className="text-white/80 text-lg mb-8">Más de 500 productos certificados esperando por ti</p>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-brand-600 font-700 px-10 py-4 rounded-2xl hover:bg-orange-50 transition shadow-xl hover:-translate-y-1 text-lg">
            Ver todos los productos 🛍️
          </Link>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA — fondo menta ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#ecfdf5 0%,#d1fae5 40%,#cffafe 100%)"}}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-mint-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-sky-200 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/80 text-mint-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">⚡ Super fácil</div>
            <h2 className="font-display font-800 text-5xl text-gray-900 mb-3">¿Cómo <span className="text-gradient">funciona</span>?</h2>
            <p className="text-gray-600 text-lg">Comprar en ToyWorld es muy fácil, en solo 4 pasos</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-300 via-rose-300 to-mint-300" />
            {steps.map((s) => (
              <div key={s.n} className="relative text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${s.color} rounded-3xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-toy group-hover:scale-110 transition-transform duration-300 relative z-10`}>{s.icon}</div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-6 h-6 bg-gray-900 text-white text-xs font-800 rounded-full flex items-center justify-center font-display z-20">{s.n}</div>
                <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-card">
                  <h3 className="font-display font-700 text-gray-900 text-lg mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POR QUÉ TOYWORLD — fondo morado suave ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#faf5ff 0%,#ede9fe 40%,#fce7f3 100%)"}}>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-rose-200 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/80 text-purple-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">💎 Lo mejor para tus hijos</div>
            <h2 className="font-display font-800 text-5xl text-gray-900 mb-3">¿Por qué <span className="text-gradient">ToyWorld</span>?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="group bg-white rounded-3xl p-7 shadow-card border border-white card-hover">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.bg} rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform`}>{f.icon}</div>
                <h3 className="font-display font-700 text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CHATBOT — fondo azul cielo ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#eff6ff 0%,#dbeafe 40%,#e0f2fe 100%)"}}>
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-4xl p-10 shadow-hover border border-sky-100 flex flex-col md:flex-row items-center gap-10">
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 gradient-brand rounded-4xl flex items-center justify-center text-6xl shadow-hover float-1">🧸</div>
              <div className="absolute -top-3 -right-3 bg-green-400 text-white text-xs font-700 px-2 py-1 rounded-full shadow animate-pulse">EN LÍNEA</div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-600 px-3 py-1 rounded-full text-xs font-600 mb-4">🤖 Asistente Virtual</div>
              <h2 className="font-display font-800 text-4xl text-gray-900 mb-3">Conoce a <span className="text-gradient">Toby</span> 🧸</h2>
              <p className="text-gray-500 mb-6 text-lg leading-relaxed">Tu asistente virtual disponible <strong>24/7</strong> para ayudarte a encontrar el juguete perfecto, resolver dudas y rastrear pedidos.</p>
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                {["🎂 Por edad","🛡️ Seguridad","📦 Pedidos","🚚 Envíos","🎁 Regalos"].map(t => (
                  <span key={t} className="bg-sky-50 border border-sky-200 text-sky-700 text-xs px-3 py-1.5 rounded-full font-500">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-gray-50 rounded-3xl p-5 w-56 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 gradient-brand rounded-full flex items-center justify-center text-sm">🧸</div>
                  <div>
                    <p className="text-xs font-700 text-gray-900">Toby</p>
                    <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span><span className="text-xs text-gray-400">En línea ahora</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3 text-xs text-gray-600 mb-3 shadow-sm">¡Hola! ¿Para qué edad buscas un juguete? 🎂</div>
                <div className="gradient-brand rounded-2xl rounded-tr-none p-3 text-xs text-white text-right ml-4">Para mi hijo de 5 años 👦</div>
                <p className="text-xs text-gray-300 text-center mt-3">Haz clic en 🧸 para chatear</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIOS — fondo amarillo suave ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#fffbeb 0%,#fef9c3 40%,#fef3c7 100%)"}}>
        <div className="absolute top-0 left-0 w-64 h-64 bg-lemon-300 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-200 rounded-full blur-3xl opacity-20" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/80 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">⭐ Clientes felices</div>
            <h2 className="font-display font-800 text-5xl text-gray-900 mb-3">Lo que dicen <span className="text-gradient">nuestros clientes</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-3xl p-7 shadow-card border border-yellow-100 card-hover relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${t.color}`} />
                <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, i) => <span key={i} className="text-lemon-400 text-xl">★</span>)}</div>
                <p className="text-gray-600 mb-6 leading-relaxed text-base">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-2xl shadow-sm`}>{t.avatar}</div>
                  <div>
                    <p className="font-display font-700 text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MAPA — fondo verde agua ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#f0fdfa 0%,#ccfbf1 40%,#cffafe 100%)"}}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-mint-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-sky-200 rounded-full blur-3xl opacity-30" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/80 text-mint-600 px-4 py-1.5 rounded-full text-sm font-600 mb-4 shadow-sm">📍 Encuéntranos</div>
            <h2 className="font-display font-800 text-5xl text-gray-900 mb-3">¿Dónde <span className="text-gradient">estamos</span>?</h2>
            <p className="text-gray-600 text-lg">Visítanos o recibe tu pedido desde nuestra tienda principal</p>
          </div>
          <div className="bg-white rounded-4xl p-8 shadow-card border border-mint-100">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center text-2xl shadow-toy">🧸</div>
                  <div>
                    <p className="font-display font-700 text-xl text-gray-900">ToyWorld</p>
                    <p className="text-gray-400">Tuxtla Gutiérrez, Chiapas, México</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[["🕐","Lun-Vie: 9:00am – 7:00pm"],["📅","Sábados: 10:00am – 5:00pm"],["📞","800-TOY-WORLD"],["📧","contacto@toyworld.mx"]].map(([i,t]) => (
                    <div key={t} className="flex items-center gap-3 text-sm text-gray-500"><span className="text-lg">{i}</span>{t}</div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["🚚 Envíos a todo México","📦 Recoge en tienda","🎁 Empaque de regalo"].map(t => (
                  <span key={t} className="bg-mint-50 border border-mint-200 text-mint-700 text-xs px-3 py-2 rounded-xl font-500">{t}</span>
                ))}
              </div>
            </div>
            <MapView showStore={true} />
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-20 px-6 relative overflow-hidden" style={{background:"linear-gradient(135deg,#f97316,#f43f5e,#a855f7,#6366f1)"}}>
        <div className="absolute inset-0 opacity-10 flex items-center justify-around text-[120px] select-none">
          <span>🧸</span><span>🎪</span><span>🎀</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center text-white z-10">
          <div className="text-5xl mb-4 float-1">🎉</div>
          <h2 className="font-display font-800 text-5xl md:text-6xl mb-4">¡Empieza hoy!</h2>
          <p className="text-white/80 mb-10 text-xl">Regístrate gratis y descubre cientos de juguetes certificados para tu hijo.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="bg-white text-brand-600 font-700 px-10 py-4 rounded-2xl hover:bg-orange-50 transition shadow-xl hover:-translate-y-1 text-lg">
              Crear cuenta gratis 🎉
            </Link>
            <Link to="/shop" className="bg-white/20 text-white font-700 px-10 py-4 rounded-2xl hover:bg-white/30 transition border-2 border-white/30 text-lg hover:-translate-y-1">
              Ver productos 🛍️
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-14 px-6" style={{background:"linear-gradient(135deg,#1e1b4b 0%,#1a1a2e 50%,#0f172a 100%)"}}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center text-lg">🧸</div>
                <span className="font-display font-800 text-xl text-white">ToyWorld</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Juguetes seguros y certificados para cada etapa del desarrollo infantil. 🌟</p>
              <div className="flex gap-3 mt-4">
                {["📘","📸","🐦","▶️"].map(e => (
                  <div key={e} className="w-9 h-9 bg-white/10 hover:bg-brand-500 rounded-xl flex items-center justify-center cursor-pointer transition text-sm">{e}</div>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display font-700 mb-4 text-sm uppercase tracking-wider text-gray-300">Tienda</p>
              <div className="space-y-3 text-sm text-gray-400">
                {["Todos los productos","Novedades","Más vendidos","Ofertas"].map(l => (
                  <p key={l}><Link to="/shop" className="hover:text-brand-400 transition">{l}</Link></p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display font-700 mb-4 text-sm uppercase tracking-wider text-gray-300">Cuenta</p>
              <div className="space-y-3 text-sm text-gray-400">
                {[["Iniciar sesión","/login"],["Registrarse","/register"],["Mis pedidos","/orders"],["Carrito","/cart"]].map(([l,h]) => (
                  <p key={l}><Link to={h} className="hover:text-brand-400 transition">{l}</Link></p>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display font-700 mb-4 text-sm uppercase tracking-wider text-gray-300">Soporte</p>
              <div className="space-y-3 text-sm text-gray-400">
                <p>📧 soporte@toyworld.mx</p>
                <p>📞 800-TOY-WORLD</p>
                <p>💬 Chat con Toby 🧸</p>
                <p>📍 Tuxtla Gutiérrez, Chis.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-sm">© 2025 ToyWorld — Todos los derechos reservados 🧸</p>
            <div className="flex gap-6 text-sm text-gray-500">
              {["Privacidad","Términos","Cookies"].map(l => (
                <span key={l} className="hover:text-white cursor-pointer transition">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
