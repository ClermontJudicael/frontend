# Frontend

[Backend](https://github.com/ClermontJudicael/backend) <br>
[React Admin](https://github.com/ClermontJudicael/admin)

## Install packages
```bash
npm install
```

## How to launch
```bash
npm run dev
```

//payment form
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PaymentForm({ eventId, ticketId, quantity, onSuccess }) {
    const router = useRouter();
    const { user, logout } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // Nouvel état pour le message de succès
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        setClientReady(true);
    }, []);

    const handlePayment = async () => {
        if (!clientReady) return;

        if (!user?.token) {
            console.error('Token manquant dans le contexte :', user);
            setError('Session expirée - Veuillez vous reconnecter');
            router.push('/login');
            return;
        }

        setIsProcessing(true);
        setError('');
        setSuccess(''); // Réinitialiser le message de succès

        try {
            const tokenPayload = JSON.parse(atob(user.token.split('.')[1]));
            if (tokenPayload.exp * 1000 < Date.now()) {
                throw new Error('Token expiré');
            }

            // 1. Création de la réservation
            const reservationResponse = await fetch(`${API_URL}/api/reservations`, {
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

            if (!reservationResponse.ok) {
                const errorData = await reservationResponse.json().catch(() => ({}));
                if (reservationResponse.status === 401 || reservationResponse.status === 403) {
                    await logout();
                    throw new Error(errorData.error || 'Session expirée');
                }
                throw new Error(errorData.message || 'Échec de la réservation');
            }

            const reservationData = await reservationResponse.json();
            console.log("Reservation Data:", reservationData);

            if (!reservationData.data || !reservationData.data.id) {
                throw new Error('Identifiant de réservation manquant');
            }

            const reservationId = reservationData.data.id;

            // 2. Paiement - On considère que c'est toujours réussi si la réservation est créée
            setSuccess('Réservation réussie ! Redirection en cours...');

            // 3. Redirection après un court délai pour voir le message
            setTimeout(() => {
                router.push(`/confirmation?reservationId=${reservationId}`);
            }, 1500);

        } catch (error) {
            console.error('Erreur de paiement:', error);
            setError(error.message.includes('Token')
                ? 'Session expirée - Veuillez vous reconnecter'
                : error.message
            );

            if (error.message.includes('expiré') || error.message.includes('authentifié')) {
                await logout();
            }
        } finally {
            setIsProcessing(false);
        }
    };


    if (!clientReady) {
        return <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">Chargement...</div>;
    }

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Paiement Sécurisé</h2>

            {/* Message d'erreur */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Message de succès */}
            {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {success}
                </div>
            )}

            <div className="space-y-4">
                <div className="p-4 bg-gray-100 rounded-md">
                    <p className="text-semibold text-black">Carte bancaire</p>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Numéro de carte
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                            placeholder="1234 5678 9012 3456"
                        />
                    </div>
                    <div className="flex space-x-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-black mb-1">
                                Date d'expiration
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded-md text-black"
                                placeholder="MM/AA"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-black mb-1">
                                CVV
                            </label>
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
                    disabled={isProcessing || !user?.token}
                    className={`w-full py-2 px-4 rounded-md text-white ${
                        isProcessing || !user?.token
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } transition-colors`}
                >
                    {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
                </button>
            </div>
        </div>
    );
}
