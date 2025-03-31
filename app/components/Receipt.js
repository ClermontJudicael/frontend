'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Receipt({ booking, event }) {
    const router = useRouter();
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        // Utilisation directe du QR généré par le backend
        if (booking?.qrCodeUrl) {
            setQrCodeUrl(booking.qrCodeUrl);
        }
    }, [booking]);

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 mt-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Paiement confirmé !</h2>

            <div className="flex justify-center my-6 p-4 bg-white border border-gray-200 rounded-lg">
                {qrCodeUrl ? (
                    <Image
                        src={qrCodeUrl}
                        alt="QR Code de réservation"
                        width={128}
                        height={128}
                        className="w-32 h-32"
                    />
                ) : (
                    <div className="w-32 h-32 bg-gray-200 animate-pulse"></div>
                )}
            </div>

            <div className="text-left space-y-3 bg-gray-50 p-4 rounded-lg mb-6">
                <p className="font-semibold">Événement: <span className="font-normal">{event.title}</span></p>
                <p className="font-semibold">Référence: <span className="font-normal">{booking.reference}</span></p>
                <p className="font-semibold">Type: <span className="font-normal capitalize">{booking.ticketType}</span></p>
                <p className="font-semibold">Quantité: <span className="font-normal">{booking.quantity}</span></p>
                <p className="font-semibold">Total: <span className="font-normal">{booking.total} €</span></p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
                <p className="text-yellow-700 text-sm">
                    Présentez ce QR code à entrée de événement.
                </p>
            </div>

            <button
                onClick={() => router.push('/events')}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                Retour aux événements
            </button>
        </div>
    );
}