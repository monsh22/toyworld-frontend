import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: string[];
}

const MENU_PRINCIPAL = [
  "🧸 Recomendar juguete por edad",
  "📦 Información de pedidos",
  "🛡️ Seguridad y certificaciones",
  "🚚 Información de envíos",
  "💳 Política de devoluciones",
  "🎁 Ideas para regalos",
  "🏷️ Ofertas y descuentos",
  "🔧 Juguetes por categoría",
  "👨‍👩‍👧 Juguetes para jugar en familia",
  "📞 Contactar soporte",
];

const RESPONSES: Record<string, { text: string; options?: string[] }> = {
  // ── EDAD ──────────────────────────────────────────
  "🧸 Recomendar juguete por edad": {
    text: "¡Con gusto! ¿Para qué rango de edad buscas el juguete?",
    options: ["👶 0-2 años", "🧒 3-5 años", "👦 6-8 años", "🧑 9-12 años", "🧑‍🦱 13+ años", "⬅️ Volver al menú"],
  },
  "👶 0-2 años": {
    text: "Para bebés de 0-2 años recomendamos:\n🎵 Juguetes musicales\n🌈 Mordedores de colores\n🪆 Cubos apilables\n📱 Móviles de cuna\n\nSon seguros, sin piezas pequeñas y estimulan los sentidos. ✅",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🧒 3-5 años": {
    text: "Para niños de 3-5 años recomendamos:\n🧱 LEGO Duplo\n🎨 Kits de pintura\n🚗 Carritos de juguete\n🧩 Rompecabezas 12-24 piezas\n🎭 Juegos de roles (cocinita, herramientas)\n\nDesarrollan motricidad y creatividad. 🌟",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "👦 6-8 años": {
    text: "Para niños de 6-8 años recomendamos:\n🧱 LEGO City\n🎮 Juegos de mesa\n🚀 Sets de ciencia\n🎯 Juegos de habilidad\n🎨 Kits de manualidades\n\nPerfectos para desarrollar lógica y trabajo en equipo. 🧠",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🧑 9-12 años": {
    text: "Para niños de 9-12 años recomendamos:\n🤖 Kits de robótica\n🧱 LEGO Technic\n🎲 Juegos de estrategia\n🎨 Kits de manualidades avanzados\n🔭 Sets de astronomía\n\n¡Perfectos para mentes curiosas! 🌟",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🧑‍🦱 13+ años": {
    text: "Para adolescentes de 13+ años recomendamos:\n🤖 Kits de programación\n🧩 Puzzles 3D\n🎮 Juegos de estrategia complejos\n🎨 Sets de arte profesional\n🔬 Kits de experimentos científicos\n\n¡Juguetes que también son educativos! 🎓",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },

  // ── PEDIDOS ───────────────────────────────────────
  "📦 Información de pedidos": {
    text: "¿Qué necesitas saber sobre tu pedido?",
    options: ["📍 ¿Dónde está mi pedido?", "❌ Cancelar un pedido", "🔄 Cambiar mi pedido", "🧾 ¿Cómo pido factura?", "⬅️ Volver al menú"],
  },
  "📍 ¿Dónde está mi pedido?": {
    text: "Puedes ver el estado en 'Mis Pedidos' del menú superior. Los estados son:\n⏳ Pendiente — recibido\n💳 Pagado — confirmado\n🚚 Enviado — en camino\n✅ Entregado — en tu puerta",
    options: ["⬅️ Volver al menú"],
  },
  "❌ Cancelar un pedido": {
    text: "Para cancelar contacta a soporte@toyworld.mx dentro de las primeras 24 horas. Si ya fue enviado, espera recibirlo y solicita devolución. 📧",
    options: ["⬅️ Volver al menú"],
  },
  "🔄 Cambiar mi pedido": {
    text: "Los cambios solo son posibles en las primeras 2 horas. Escríbenos a soporte@toyworld.mx con tu número de pedido. ⏰",
    options: ["⬅️ Volver al menú"],
  },
  "🧾 ¿Cómo pido factura?": {
    text: "Para solicitar factura:\n1️⃣ Escribe a soporte@toyworld.mx\n2️⃣ Indica tu número de pedido y RFC\n3️⃣ La recibirás en máximo 48 horas 📄",
    options: ["⬅️ Volver al menú"],
  },

  // ── SEGURIDAD ─────────────────────────────────────
  "🛡️ Seguridad y certificaciones": {
    text: "¿Qué quieres saber sobre seguridad?",
    options: ["✅ ¿Qué significa certificado?", "⚠️ ¿Qué evitar por edad?", "🧪 ¿Los materiales son seguros?", "⬅️ Volver al menú"],
  },
  "✅ ¿Qué significa certificado?": {
    text: "Un juguete certificado cumple normas internacionales:\n✅ Materiales no tóxicos\n✅ Sin bordes filosos\n✅ Sin piezas peligrosas para la edad\n✅ Probado en laboratorio\n\nBusca el sello ✅ en cada producto. 🛡️",
    options: ["⬅️ Volver al menú"],
  },
  "⚠️ ¿Qué evitar por edad?": {
    text: "⚠️ Menores de 3 años: evitar piezas pequeñas, cuerdas largas y globos.\n⚠️ 3-6 años: evitar juguetes con partes muy pequeñas.\n⚠️ Siempre supervisa a los niños durante el juego. 👨‍👩‍👧",
    options: ["⬅️ Volver al menú"],
  },
  "🧪 ¿Los materiales son seguros?": {
    text: "Sí. Todos nuestros juguetes usan:\n🌿 Plásticos libres de BPA\n🎨 Pinturas atóxicas\n🧵 Telas hipoalergénicas\n🪵 Maderas certificadas FSC\n\nTu hijo puede jugar con total tranquilidad. 💚",
    options: ["⬅️ Volver al menú"],
  },

  // ── ENVÍOS ────────────────────────────────────────
  "🚚 Información de envíos": {
    text: "¿Qué quieres saber sobre los envíos?",
    options: ["⏱️ ¿Cuánto tarda?", "💰 ¿Cuánto cuesta?", "🗺️ ¿A dónde envían?", "📦 ¿Cómo viene empaquetado?", "⬅️ Volver al menú"],
  },
  "⏱️ ¿Cuánto tarda?": {
    text: "⏱️ Tiempos de entrega:\n🏙️ CDMX y ZM: 1-2 días hábiles\n🌆 Ciudades principales: 2-3 días\n🌎 Resto del país: 3-5 días hábiles\n\nEnvíos de lunes a viernes. 🚀",
    options: ["⬅️ Volver al menú"],
  },
  "💰 ¿Cuánto cuesta?": {
    text: "💰 Costos de envío:\n🎉 GRATIS en pedidos +$500 MXN\n📦 Estándar: $99 MXN\n🚀 Express: $149 MXN\n\nEl costo se calcula al momento de tu compra. 🛒",
    options: ["⬅️ Volver al menú"],
  },
  "🗺️ ¿A dónde envían?": {
    text: "🗺️ Zonas de envío:\n✅ Toda la República Mexicana\n🔜 Estados Unidos (próximamente)\n🔜 Canadá (próximamente)\n\n¡Llevamos la diversión a todo México! 🇲🇽",
    options: ["⬅️ Volver al menú"],
  },
  "📦 ¿Cómo viene empaquetado?": {
    text: "Todos los pedidos vienen:\n📦 Caja resistente para proteger el juguete\n🌿 Materiales reciclables\n🎀 Opción de empaque para regalo (+$30 MXN)\n\nPerfecto para regalar directo. 🎁",
    options: ["⬅️ Volver al menú"],
  },

  // ── DEVOLUCIONES ──────────────────────────────────
  "💳 Política de devoluciones": {
    text: "¿Qué quieres saber sobre devoluciones?",
    options: ["📋 Ver condiciones", "🔄 ¿Cómo hago una devolución?", "💵 ¿Cuándo recibo mi reembolso?", "⬅️ Volver al menú"],
  },
  "📋 Ver condiciones": {
    text: "✅ 30 días para devoluciones\n✅ Producto sin uso y en empaque original\n✅ Reembolso completo o cambio\n❌ No aplica en productos personalizados\n❌ No aplica si el juguete fue usado",
    options: ["🔄 ¿Cómo hago una devolución?", "⬅️ Volver al menú"],
  },
  "🔄 ¿Cómo hago una devolución?": {
    text: "1️⃣ Escribe a soporte@toyworld.mx\n2️⃣ Indica tu número de pedido\n3️⃣ Describe el motivo\n4️⃣ Te enviamos instrucciones en 24h\n5️⃣ Reembolso en 3-5 días hábiles 💚",
    options: ["⬅️ Volver al menú"],
  },
  "💵 ¿Cuándo recibo mi reembolso?": {
    text: "Una vez aprobada la devolución:\n💳 Tarjeta de crédito/débito: 3-5 días\n🏦 Transferencia bancaria: 1-2 días\n\nTe notificaremos por email en cada paso. 📧",
    options: ["⬅️ Volver al menú"],
  },

  // ── REGALOS ───────────────────────────────────────
  "🎁 Ideas para regalos": {
    text: "¿Para quién es el regalo?",
    options: ["👶 Regalo para bebé", "🎂 Regalo de cumpleaños", "🎄 Regalo de Navidad", "👨‍👩‍👧 Regalo familiar", "⬅️ Volver al menú"],
  },
  "👶 Regalo para bebé": {
    text: "Para un bebé el regalo perfecto es:\n🎵 Set musical de tela\n🌈 Móvil de colores\n🐻 Peluche suave certificado\n🧸 Set de cubos apilables\n\nTodos seguros para 0+ meses. 💚",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🎂 Regalo de cumpleaños": {
    text: "Para cumpleaños recomendamos:\n🧱 Sets de construcción LEGO\n🎨 Kits creativos\n🤖 Juguetes tecnológicos\n🎲 Juegos de mesa divertidos\n\n¡Ofrecemos empaque de regalo! 🎀",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🎄 Regalo de Navidad": {
    text: "Los más pedidos en Navidad:\n⭐ Sets de LEGO grandes\n🤖 Kits de robótica\n🎮 Juegos de mesa familiares\n🧸 Peluches premium\n🎨 Sets de arte completos\n\n¡Pide con tiempo para garantizar entrega! 📦",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "👨‍👩‍👧 Regalo familiar": {
    text: "Regalos para disfrutar en familia:\n🎲 Juegos de mesa (Catán, Ticket to Ride)\n🧩 Puzzles grandes 500-1000 piezas\n🎨 Sets de pintura familiares\n🏕️ Juegos de exterior\n\n¡Momentos que valen oro! 💛",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },

  // ── OFERTAS ───────────────────────────────────────
  "🏷️ Ofertas y descuentos": {
    text: "¿Qué tipo de oferta buscas?",
    options: ["🔥 ¿Hay ofertas activas?", "📧 Suscribirme a ofertas", "🎓 Descuento para maestros", "⬅️ Volver al menú"],
  },
  "🔥 ¿Hay ofertas activas?": {
    text: "¡Siempre tenemos promociones! Visita nuestra tienda y busca los productos con etiqueta de oferta. También puedes suscribirte a nuestro newsletter para recibir descuentos exclusivos. 🎉",
    options: ["🔍 Ver tienda", "📧 Suscribirme a ofertas", "⬅️ Volver al menú"],
  },
  "📧 Suscribirme a ofertas": {
    text: "Para recibir ofertas exclusivas:\n📧 Escribe a newsletter@toyworld.mx\n📱 O síguenos en redes sociales\n\nRibe 10% de descuento en tu primera compra al suscribirte. 🎁",
    options: ["⬅️ Volver al menú"],
  },
  "🎓 Descuento para maestros": {
    text: "¡Tenemos programa especial para educadores! 🎓\n✅ 15% de descuento en juguetes educativos\n✅ Envío gratis en pedidos +$300\n\nEscribe a educacion@toyworld.mx con tu credencial. 📚",
    options: ["⬅️ Volver al menú"],
  },

  // ── CATEGORÍAS ────────────────────────────────────
  "🔧 Juguetes por categoría": {
    text: "¿Qué tipo de juguete buscas?",
    options: ["🧱 Construcción", "🎨 Arte y manualidades", "🤖 Tecnología y robótica", "🏃 Juguetes activos", "🧩 Juegos de mesa", "⬅️ Volver al menú"],
  },
  "🧱 Construcción": {
    text: "Juguetes de construcción disponibles:\n🧱 LEGO (todas las edades)\n🏗️ Bloques de madera\n🔩 Sets de ingeniería\n🏰 Castillos y ciudades\n\nDesarrollan creatividad y matemáticas. 🧠",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🎨 Arte y manualidades": {
    text: "Kits de arte disponibles:\n🎨 Pinturas y pinceles\n✏️ Sets de dibujo\n🧵 Kits de costura para niños\n🪡 Sets de tejido básico\n🖌️ Arcilla y modelado\n\nPerfectos para pequeños artistas. 🌟",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🤖 Tecnología y robótica": {
    text: "Juguetes tecnológicos:\n🤖 Robots programables\n💻 Kits de coding para niños\n🔬 Sets de electrónica\n🚀 Drones para principiantes\n\nEl futuro empieza jugando. 🚀",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🏃 Juguetes activos": {
    text: "Juguetes para moverse:\n🚴 Bicicletas y patines\n⚽ Balones deportivos\n🏸 Sets de bádminton\n🤸 Columpios y resbaladillas\n🎯 Juegos de puntería\n\n¡Salud y diversión juntos! 💪",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🧩 Juegos de mesa": {
    text: "Juegos de mesa populares:\n🎲 Juegos de dados\n🃏 Juegos de cartas\n♟️ Ajedrez y damas\n🗺️ Juegos de estrategia\n😂 Juegos de palabras\n\nPerfectos para toda la familia. 👨‍👩‍👧",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },

  // ── FAMILIA ───────────────────────────────────────
  "👨‍👩‍👧 Juguetes para jugar en familia": {
    text: "¿Cuántas personas jugarán?",
    options: ["👫 2 personas", "👨‍👩‍👦 3-4 personas", "🎉 5+ personas", "⬅️ Volver al menú"],
  },
  "👫 2 personas": {
    text: "Para 2 jugadores:\n♟️ Ajedrez y damas\n🎯 Juegos de puntería\n🃏 Juegos de cartas duelo\n🧩 Puzzles cooperativos\n\n¡Perfectos para parejas o hermanos! 💛",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "👨‍👩‍👦 3-4 personas": {
    text: "Para 3-4 jugadores:\n🎲 Catán Junior\n🃏 UNO y Skip-Bo\n🗺️ Ticket to Ride\n🎭 Dixit\n\n¡La cantidad perfecta para jugar en familia! 🌟",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },
  "🎉 5+ personas": {
    text: "Para grupos grandes:\n😂 Tabú y Pictionary\n🎤 Karaoke familiar\n🤸 Twister\n🎯 Juegos de exterior\n🃏 Juegos de cartas grupales\n\n¡Entre más, más diversión! 🎉",
    options: ["🔍 Ver tienda", "⬅️ Volver al menú"],
  },

  // ── SOPORTE ───────────────────────────────────────
  "📞 Contactar soporte": {
    text: "¿Cómo prefieres contactarnos?",
    options: ["📧 Enviar email", "📞 Llamar por teléfono", "🕐 Horarios de atención", "⬅️ Volver al menú"],
  },
  "📧 Enviar email": {
    text: "📧 Correos de contacto:\n🛒 Pedidos: pedidos@toyworld.mx\n🔄 Devoluciones: devoluciones@toyworld.mx\n💬 General: soporte@toyworld.mx\n\nRespuesta en máximo 24 horas. ⏰",
    options: ["⬅️ Volver al menú"],
  },
  "📞 Llamar por teléfono": {
    text: "📞 Teléfonos de contacto:\n☎️ 800-TOY-WORLD (gratuito)\n📱 55 1234 5678 (WhatsApp)\n\nLunes a Viernes 9am-6pm\nSábados 10am-2pm 🕐",
    options: ["⬅️ Volver al menú"],
  },
  "🕐 Horarios de atención": {
    text: "🕐 Horarios de atención al cliente:\n📅 Lunes a Viernes: 9:00am - 6:00pm\n📅 Sábados: 10:00am - 2:00pm\n❌ Domingos y festivos: cerrado\n\n🤖 Toby disponible 24/7 para ayudarte! 🧸",
    options: ["⬅️ Volver al menú"],
  },

  // ── GENERALES ─────────────────────────────────────
  "🔍 Ver tienda": {
    text: "¡Visita nuestra tienda en el menú superior! Puedes buscar por nombre y encontrar el juguete perfecto. 🛍️",
    options: ["⬅️ Volver al menú"],
  },
  "⬅️ Volver al menú": {
    text: "¿En qué más te puedo ayudar? 😊",
    options: MENU_PRINCIPAL,
  },
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy Toby 🧸, el asistente de ToyWorld. ¿En qué te puedo ayudar?",
      options: MENU_PRINCIPAL,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOption = (option: string) => {
    setMessages(prev => [...prev, { role: "user", content: option }]);
    const response = RESPONSES[option];
    if (response) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: response.text,
          options: response.options,
        }]);
      }, 400);
    }
  };

  const handleInput = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Entiendo tu consulta 😊. Para ayudarte mejor, selecciona una opción:",
        options: MENU_PRINCIPAL,
      }]);
    }, 400);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 gradient-brand rounded-full shadow-hover flex items-center justify-center text-2xl hover:scale-110 transition-transform">
        {open ? "✕" : "🧸"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden" style={{ height: "500px" }}>
          <div className="gradient-brand px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🧸</div>
            <div>
              <p className="font-display font-700 text-white text-sm">Toby — Asistente ToyWorld</p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-300 rounded-full"></span>
                <span className="text-white/80 text-xs">En línea</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i}>
                <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 gradient-brand rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">🧸</div>
                  )}
                  <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "gradient-brand text-white rounded-br-sm"
                      : "bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100"
                  }`}>
                    {m.content}
                  </div>
                </div>
                {m.options && m.role === "assistant" && i === messages.length - 1 && (
                  <div className="mt-2 ml-9 flex flex-col gap-1.5">
                    {m.options.map((opt) => (
                      <button key={opt} onClick={() => handleOption(opt)}
                        className="text-left text-xs bg-white border border-brand-200 text-brand-600 px-3 py-2 rounded-xl hover:bg-brand-50 hover:border-brand-400 transition font-500 shadow-sm">
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
            <input
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 font-body"
              placeholder="O escribe tu pregunta..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleInput()}
            />
            <button onClick={handleInput} disabled={!input.trim()}
              className="gradient-brand text-white w-9 h-9 rounded-xl flex items-center justify-center hover:shadow-toy transition disabled:opacity-40">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
