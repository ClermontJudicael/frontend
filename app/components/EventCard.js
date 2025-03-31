'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

export default function EventCard({ event }) {
    // Configuration des images
    const { imageUrl, imageAlt } = useMemo(() => ({
        imageUrl: event.image_url || '/images/events/default-event.jpg',
        imageAlt: event.image_alt || `Image de l'événement: ${event.title}`
    }), [event.image_url, event.image_alt, event.title]);

    // Formatage de la date
    const formattedDate = useMemo(() => (
        new Date(event.date).toLocaleDateString('fr-FR', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    ), [event.date]);

    // Correction clé : Utilisation de event._id pour MongoDB et /events/[eventId]
    const eventId = event._id || event.id; // Gère les deux cas (MongoDB _id ou autre)
    const eventLink = `/events/${eventId}`; // Correspond à votre structure app/events/[eventId]

    return (
        <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image avec placeholder */}
            <div className="relative aspect-video w-full">
                <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="/images/events/blur-placeholder.jpg" // Ajout d'un chemin valide
                    priority={false}
                />
                {/* Badge de catégorie */}
                {event.category && (
                    <span className="absolute top-3 right-3 bg-blue-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {event.category}
          </span>
                )}
            </div>

            {/* Contenu */}
            <div className="p-5 space-y-3">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {event.description}
                    </p>
                </div>

                {/* Métadonnées */}
                <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                        <CalendarIcon className="w-4 h-4 mr-1.5" />
                        <time dateTime={event.date}>{formattedDate}</time>
                    </div>
                    <div className="flex items-center text-gray-500">
                        <LocationIcon className="w-4 h-4 mr-1.5" />
                        <address className="not-italic">{event.location}</address>
                    </div>
                </div>

                {/* Bouton d'action - Lien corrigé */}
                <Link
                    href={eventLink}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
                    aria-label={`Voir les détails de ${event.title}`}
                    prefetch={false} // Optionnel : désactive le préchargement si nécessaire
                >
                    Voir les détails
                    <ArrowIcon className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </article>
    );
}

// Composants d'icônes inchangés
function CalendarIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );
}

function LocationIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function ArrowIcon(props) {
    return (
        <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
    );
}