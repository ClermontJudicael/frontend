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

function TicketIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
    );
}

function BackIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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

                const id = Number(eventId);
                if (isNaN(id)) {
                    throw new Error(`ID invalide: ${eventId}`);
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
                if (ticketsData.length > 0) {
                    setSelectedTicket(ticketsData[0]);
                }

            } catch (error) {
                console.error('Erreur dans loadEventData:', {
                    eventId,
                    message: error.message
                });
                setError(error.message || 'Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            loadEventData();
        }
    }, [eventId, router]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReservation = () => {
        if (!selectedTicket) {
            setError('Veuillez sélectionner un billet');
            return;
        }

        router.push(`/checkout?eventId=${eventId}&ticketId=${selectedTicket.id}&quantity=${quantity}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
                    <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">Erreur</h3>
                    <p className="text-gray-700 text-center mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/events')}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                        <BackIcon className="w-5 h-5 mr-2" />
                        Retour aux événements
                    </button>
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-bold mb-2">Événement non trouvé</h3>
                    <p className="text-gray-700 mb-6">Cet événement n'existe pas ou a été supprimé.</p>
                    <button
                        onClick={() => router.push('/events')}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center"
                    >
                        <BackIcon className="w-5 h-5 mr-2" />
                        Voir tous les événements
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <button 
                    onClick={() => router.push('/events')}
                    className="mb-8 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                    <BackIcon className="w-5 h-5 mr-2" />
                    Retour aux événements
                </button>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
                    {/* Hero Section with Image Banner */}
                    <div className="relative h-80 md:h-96 w-full bg-gray-200">
                        {event.image_url && (
                            <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="100vw"
                            />
                        )}
                        {!event.image_url && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        {event.category && (
                            <div className="absolute top-6 left-6">
                                <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                                    {event.category}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col lg:flex-row">
                        {/* Event Details */}
                        <div className="lg:w-3/5 p-6 md:p-10">
                            <h1 className="text-3xl md:text-4xl text-blue-500 font-bold mb-6">{event.title}</h1>
                            
                            <div className="flex flex-wrap gap-8 mb-10">
                                <div className="flex items-start">
                                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg mb-1">Date</p>
                                        <p className="text-gray-800">{formatDate(event.date)}</p>
                                        <p className="text-gray-800 font-medium">{formatTime(event.date)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-start">
                                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                                        <LocationIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg mb-1">Lieu</p>
                                        <p className="text-gray-800">{event.location}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <h2 className="text-2xl text-gray-800 font-bold mb-4">À propos de cet événement</h2>
                                <div className="prose max-w-none text-gray-800 text-lg leading-relaxed">
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Ticket Selection */}
                        <div className="lg:w-2/5 bg-gray-50 p-6 md:p-10">
                            <div className="sticky top-6">
                                <div className="flex items-center mb-8">
                                    <div className="rounded-full bg-blue-100 p-3 mr-4">
                                        <TicketIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl text-gray-800 font-bold">Billets</h2>
                                </div>
                                
                                {tickets.length > 0 ? (
                                    <>
                                        <div className="space-y-5 mb-10">
                                            {tickets.map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                                                        selectedTicket?.id === ticket.id
                                                            ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedTicket(ticket);
                                                        setQuantity(1);
                                                        setError(null);
                                                    }}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-semibold text-gray-800 text-xl">{ticket.type}</h3>
                                                        <span className="font-bold text-xl">{ticket.price} €</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-base text-gray-800 font-medium">
                                                            {ticket.available_quantity} billets disponibles
                                                        </p>
                                                        {selectedTicket?.id === ticket.id && (
                                                            <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {selectedTicket && (
                                            <>
                                                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <label className="block text-gray-800 font-semibold text-lg">Quantité</label>
                                                        <div className="flex items-center border-2 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border-r-2 text-xl text-gray-400 font-medium"
                                                                aria-label="Réduire la quantité"
                                                                disabled={quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-6 py-2 text-center min-w-[50px] font-medium">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => setQuantity(q =>
                                                                    Math.min(q + 1, selectedTicket.purchase_limit || 10, selectedTicket.available_quantity))}
                                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border-l-2 text-xl font-medium text-gray-400"
                                                                aria-label="Augmenter la quantité"
                                                                disabled={quantity >= (selectedTicket.purchase_limit || 10) || quantity >= selectedTicket.available_quantity}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center text-lg mb-2">
                                                        <span className="font-medium text-gray-800">Prix unitaire:</span>
                                                        <span className="font-bold text-gray-800">{selectedTicket.price} €</span>
                                                    </div>
                                                    
                                                    {quantity > 1 && (
                                                        <div className="flex justify-between items-center text-base text-gray-800 mb-4 border-t pt-4 mt-4">
                                                            <span>{quantity} × {selectedTicket.price} €</span>
                                                            <span className="font-medium">{(selectedTicket.price * quantity).toFixed(2)} €</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200 mb-8">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="font-bold text-gray-800 text-xl">Total:</span>
                                                        <span className="font-bold text-2xl text-blue-700">
                                                            {(selectedTicket.price * quantity).toFixed(2)} €
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 mb-6">Taxes incluses</p>
                                                    
                                                    <button
                                                        onClick={handleReservation}
                                                        className="w-full py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                    >
                                                        <span>Réserver maintenant</span>
                                                    </button>
                                                </div>
                                                
                                                <div className="text-center text-base text-gray-700 bg-gray-100 p-4 rounded-lg">
                                                    <p>Les billets ne sont pas remboursables après achat.</p>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-lg border-2 border-gray-200">
                                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-700 font-medium text-lg mb-6">Aucun billet disponible pour cet événement</p>
                                        <button
                                            onClick={() => router.push('/events')}
                                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            Voir d'autres événements
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}