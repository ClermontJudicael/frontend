'use client';
import { useState } from 'react';
import { processPayment } from '../lib/api';

export default function PaymentForm({ booking, onSuccess, onBack }) {
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsProcessing(true);

        try {
            const receipt = await processPayment({
                ...booking,
                paymentDetails: paymentData
            });
            onSuccess(receipt);
        } catch (err) {
            setError(err.message || 'Le paiement a échoué');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Paiement sécurisé</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de carte
                    </label>
                    <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expiration
                        </label>
                        <input
                            type="text"
                            value={paymentData.expiry}
                            onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                            placeholder="MM/AA"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                        </label>
                        <input
                            type="text"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        className={`px-4 py-2 rounded-md text-white ${isProcessing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
                    >
                        {isProcessing ? 'Traitement...' : `Payer ${booking?.total} €`}
                    </button>
                </div>
            </form>
        </div>
    );
}