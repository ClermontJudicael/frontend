'use client';
import { useSearchParams } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';

export default function CheckoutPage() {
    const searchParams = useSearchParams();

    // Récupération des paramètres
    const eventId = searchParams.get('eventId');
    const ticketId = searchParams.get('ticketId');
    const quantity = searchParams.get('quantity');

    // Validation
    if (!eventId || !ticketId) {
        return (
            <div className="p-4 text-red-600">
                Paramètres de réservation manquants
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Finaliser votre réservation</h1>
            <PaymentForm
                eventId={eventId}
                ticketId={ticketId}
                quantity={quantity}
            />
        </div>
    );
}