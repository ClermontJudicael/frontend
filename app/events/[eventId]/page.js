'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchEventById, fetchEventTickets } from '../../lib/api';
import Image from 'next/image';

// Icon components
function CalendarIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function LocationIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

export default function EventDetailPage() {
    const router = useRouter();
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEventData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log('[debug] eventId avant traitement:', eventId);

                // Conversion et validation de eventId
                const id = Number(eventId);
                if (isNaN(id)) {
                    throw new Error(`ID invalide: ${eventId} (type: ${typeof eventId})`);
                }

                const [eventData, ticketsData] = await Promise.all([
                    fetchEventById(id).catch(e => {
                        console.error('Erreur fetchEventById:', e);
                        throw e;
                    }),
                    fetchEventTickets(id).catch(e => {
                        console.error('Erreur fetchEventTickets:', e);
                        return [];
                    })
                ]);

                setEvent(eventData);
                setTickets(ticketsData);

            } catch (error) {
                console.error('Erreur complète dans loadEventData:', {
                    eventId,
                    error: {
                        name: error.name,
                        message: error.message,
                        stack: error.stack
                    }
                });
                setError(error.message || 'Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            console.log('[debug] Début du chargement pour eventId:', eventId);
            loadEventData();
        }
    }, [eventId, router]);

    const handleReservation = () => {
        if (!selectedTicket) {
            setError('Veuillez sélectionner un billet');
            return;
        }

        router.push(`/checkout?eventId=${eventId}&ticketId=${selectedTicket.id}&quantity=${quantity}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto p-6 bg-red-50 border-l-4 border-red-500">
                <h3 className="text-red-800 font-bold">Erreur</h3>
                <p className="text-red-700">{error}</p>
                <button
                    onClick={() => router.push('/events')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Retour aux événements
                </button>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <p className="text-lg">Événement non trouvé</p>
                <button
                    onClick={() => router.push('/events')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    Retour à la liste des événements
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Colonne de gauche - Détails de l'événement */}
                <div className="md:w-1/2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="relative h-64">
                            <Image
                                src={event.image_url || '/images/events/default.jpg'}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="p-6">
                            <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
                            <p className="text-gray-600 mb-4">{event.description}</p>

                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>
                                        {new Date(event.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center">
                                    <LocationIcon className="w-5 h-5 mr-2 text-gray-500" />
                                    <span>{event.location}</span>
                                </div>

                                {event.category && (
                                    <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                        {event.category}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colonne de droite - Sélection de billet */}
                <div className="md:w-1/2">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-4">Choisissez vos billets</h2>

                        {tickets.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {tickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                                selectedTicket?.id === ticket.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                            onClick={() => {
                                                setSelectedTicket(ticket);
                                                setError(null);
                                            }}
                                        >
                                            <div className="flex justify-between">
                                                <h3 className="font-medium">{ticket.type}</h3>
                                                <span className="font-bold">{ticket.price} €</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Disponibles: {ticket.available_quantity}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {selectedTicket && (
                                    <div className="mt-6">
                                        <label className="block mb-2 font-medium">Quantité</label>
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="px-3 py-1 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                                                aria-label="Réduire la quantité"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1 border-t border-b text-center">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(q =>
                                                    Math.min(q + 1, selectedTicket.purchase_limit || 10))}
                                                className="px-3 py-1 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                                                aria-label="Augmenter la quantité"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="mt-4 pt-4 border-t">
                                            <div className="flex justify-between mb-2">
                                                <span>Total:</span>
                                                <span className="font-bold">
                                                    {(selectedTicket.price * quantity).toFixed(2)} €
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/checkout?eventId=${eventId}&ticketId=${selectedTicket.id}&quantity=${quantity}`)}
                                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Réserver maintenant
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-4">
                            <p className="text-gray-500">Aucun billet disponible pour cet événement</p>
                                <button
                                    onClick={() => router.push('/events')}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Voir d'autres événements
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
