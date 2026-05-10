import { useCartStore } from "../store/cartStore";

interface Props {
  product: { id: number; name: string; price: number; image_url?: string; min_age: number; max_age: number; is_safe_certified: boolean; description?: string; };
}

export default function ProductCard({ product }: Props) {
  const add = useCartStore((s) => s.add);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-card border border-gray-100 card-hover group">
      {/* Image */}
      <div className="h-44 bg-gradient-to-br from-orange-50 to-rose-50 flex items-center justify-center relative overflow-hidden">
        {product.image_url
          ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          : <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🧸</span>
        }
        {product.is_safe_certified && (
          <div className="absolute top-3 right-3 bg-mint-400 text-white text-xs px-2 py-0.5 rounded-full font-600 shadow">
            ✅ Cert.
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-700 text-gray-900 text-base leading-tight mb-1">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">{product.description}</p>
        )}
        <div className="flex gap-1.5 mb-3">
          <span className="text-xs bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full font-500">
            🎂 {product.min_age}–{product.max_age} años
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-800 text-xl text-brand-500">${product.price.toFixed(2)}</span>
          <button
            onClick={() => add({ id: product.id, name: product.name, price: product.price, quantity: 1, image_url: product.image_url })}
            className="gradient-brand text-white text-sm font-600 px-4 py-1.5 rounded-xl shadow-toy hover:shadow-hover transition-all hover:-translate-y-0.5">
            + Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
