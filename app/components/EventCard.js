"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

// Importation dynamique pour éviter l'erreur de module manquant
const Calendar = dynamic(
  () => import("lucide-react").then((mod) => mod.Calendar),
  { ssr: false }
);
const MapPin = dynamic(() => import("lucide-react").then((mod) => mod.MapPin), {
  ssr: false,
});
const ArrowRight = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowRight),
  { ssr: false }
);

export default function EventCard({ event }) {
  if (!event) return null; // Évite les erreurs si event est undefined

  // Configuratiaon des images
  const imageUrl = event?.image_url || "/images/events/default-event.jpg";
  const imageAlt =
    event?.image_alt || `Image de l'événement: ${event?.title || "Inconnu"}`;

  // Formatage de la date
  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString("fr-FR", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date inconnue";

  // Vérification de l'ID de l'événement
  const eventId = event?._id ?? event?.id ?? "unknown";
  const eventLink = `/events/${eventId}`;

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image avec placeholder sécurisé */}
      <div className="relative aspect-video w-full">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="/images/events/blur-placeholder.jpg"
          priority={false}
        />
        {event?.category && (
          <span className="absolute top-3 right-3  text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
            {event.category}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {event?.title || "Titre inconnu"}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {event?.description || "Aucune description disponible."}
          </p>
        </div>

        {/* Métadonnées */}
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1.5" />
            <time dateTime={event?.date}>{formattedDate}</time>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1.5" />
            <address className="not-italic">
              {event?.location || "Lieu inconnu"}
            </address>
          </div>
        </div>

        {/* Bouton d'action */}
        <Link
          href={eventLink}
          className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all"
          aria-label={`Voir les détails de ${event?.title || "cet événement"}`}
          prefetch={false}
        >
          Voir les détails
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </article>
  );
}
