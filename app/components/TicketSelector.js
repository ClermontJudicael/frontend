'use client';
import { useState } from 'react';

export default function TicketSelector({ event, onSubmit }) {
    const [ticketType, setTicketType] = useState('standard');
    const [quantity, setQuantity] = useState(1);

    const ticketOptions = [
        { id: 'standard', name: 'Standard', price: event.standardPrice },
        { id: 'vip', name: 'VIP', price: event.vipPrice },
        { id: 'premium', name: 'Premium', price: event.premiumPrice }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ticketType,
            quantity,
            total: quantity * ticketOptions.find(t => t.id === ticketType).price
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Choisissez vos billets</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de billet
                    </label>
                    <select
                        value={ticketType}
                        onChange={(e) => setTicketType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {ticketOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name} - {option.price} €
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="pt-2">
                    <p className="text-lg font-semibold">
                        Total: {quantity * ticketOptions.find(t => t.id === ticketType).price} €
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mt-4"
                >
                    Continuer vers le paiement
                </button>
            </form>
        </div>
    );
}