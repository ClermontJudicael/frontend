'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext'; // Supposons que vous avez un contexte d'authentification

export default function PaymentForm({ eventId, ticketId, quantity, onSuccess }) {
    const router = useRouter();
    const { user } = useAuth(); // Récupérez l'utilisateur connecté
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setIsProcessing(true);
        setError('');
        let reservationData = null; // Déclarez-la ici pour la rendre disponible dans tout le bloc

        try {
            // 1. Créer la réservation
            const reservationResponse = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    eventId,
                    ticketId,
                    quantity,
                    paymentMethod: 'credit_card'
                })
            });

            // Parsez la réponse avant de vérifier le statut
            reservationData = await reservationResponse.json();

            if (!reservationResponse.ok) {
                throw new Error(reservationData.message || 'Échec de la création de la réservation');
            }

            // 2. Paiement
            const paymentResponse = await fetch(`/api/reservations/${reservationData.id}/pay`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    paymentMethod: 'credit_card'
                })
            });

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                throw new Error(paymentData.message || 'Échec du paiement');
            }

            // Succès
            if (onSuccess) onSuccess(paymentData);
            router.push(`/confirmation?reservationId=${reservationData.id}`);

        } catch (error) {
            console.error('Erreur complète:', error);
            setError(error.message);

            // Annulation seulement si la réservation a été créée
            if (reservationData?.id) {
                try {
                    await fetch(`/api/reservations/${reservationData.id}/cancel`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                } catch (cancelError) {
                    console.error("Échec de l'annulation:", cancelError);
                }
            }
        } finally {
            setIsProcessing(false);
        }
    };
    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Paiement Sécurisé</h2>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-semibold text-black">Carte bancaire</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">Numéro de carte</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-black mb-1">Date d'expiration</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md text-black"
                                placeholder="MM/AA"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-black mb-1">CVV</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md text-black"
                                placeholder="123"
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        isProcessing ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {isProcessing ? 'Traitement...' : 'Payer'}
                </button>
            </div>
        </div>
    );
}