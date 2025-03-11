'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function EventCard({ event }) {
  // Image par défaut si aucune image n'est fournie
  const defaultImage = '/images/events/default-event.jpg';
  const imageUrl = event.image_url || defaultImage;
  const imageAlt = event.image_alt || event.title;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 mb-2 line-clamp-2">{event.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>{new Date(event.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
          <span>{event.location}</span>
        </div>
        <Link
          href={`/event/${event.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Voir les détails
        </Link>
      </div>
    </div>
  );
} 