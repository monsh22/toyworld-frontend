import { useState } from "react";

interface Props {
  total: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function FakePayment({ total, onSuccess, onCancel }: Props) {
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="font-display font-800 text-2xl text-gray-900 mb-1">💳 Pago Seguro</h2>
        <p className="text-gray-400 text-sm mb-6">Total: <span className="font-700 text-brand-500">${total.toFixed(2)}</span></p>
        <div className="space-y-3">
          <input placeholder="Número de tarjeta" maxLength={16}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 text-sm"
            value={card.number} onChange={e => setCard({ ...card, number: e.target.value })} />
          <input placeholder="Nombre en la tarjeta"
            className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 text-sm"
            value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="MM/AA" maxLength={5}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 text-sm"
              value={card.expiry} onChange={e => setCard({ ...card, expiry: e.target.value })} />
            <input placeholder="CVV" maxLength={3}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-brand-400 text-sm"
              value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value })} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 font-600 py-3 rounded-2xl hover:bg-gray-200 transition">
            Cancelar
          </button>
          <button onClick={handlePay} disabled={loading}
            className="flex-1 gradient-brand text-white font-700 py-3 rounded-2xl shadow-toy hover:shadow-hover transition disabled:opacity-60">
            {loading ? "Procesando..." : "Pagar 💳"}
          </button>
        </div>
      </div>
    </div>
  );
}
