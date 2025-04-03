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
const Clock = dynamic(() => import("lucide-react").then((mod) => mod.Clock), {
  ssr: false,
});
const Tag = dynamic(() => import("lucide-react").then((mod) => mod.Tag), {
  ssr: false,
});

export default function EventCard({ event }) {
  if (!event) return null; // Évite les erreurs si event est undefined

  // Configuration des images
  const imageUrl = event?.image_url || "/images/events/default-event.jpg";
  const imageAlt =
    event?.image_alt || `Image de l'événement: ${event?.title || "Inconnu"}`;

  // Formatage de la date et de l'heure séparément pour un meilleur design
  const eventDate = event?.date ? new Date(event.date) : null;
  
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("fr-FR", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";
    
  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Vérification de l'ID de l'événement
  const eventId = event?._id ?? event?.id ?? "unknown";
  const eventLink = `/events/${eventId}`;

  // Déterminer la couleur de l'étiquette de catégorie
  const getCategoryColorClass = (category) => {
    if (!category) return "bg-gray-600";
    
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes("concert")) return "bg-purple-600";
    if (categoryLower.includes("sport")) return "bg-green-600";
    if (categoryLower.includes("théâtre") || categoryLower.includes("theatre")) return "bg-red-600";
    if (categoryLower.includes("exposition")) return "bg-amber-600";
    if (categoryLower.includes("conférence") || categoryLower.includes("conference")) return "bg-blue-600";
    
    return "bg-indigo-600";
  };

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
      {/* Image avec effet de hover élégant */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="/images/events/blur-placeholder.jpg"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {event?.category && (
          <span className={`absolute top-3 left-3 text-white text-xs font-medium px-3 py-1.5 rounded-full ${getCategoryColorClass(event.category)} shadow-md flex items-center gap-1`}>
            <Tag className="w-3 h-3" />
            {event.category}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-3 flex-grow">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {event?.title || "Titre inconnu"}
          </h3>
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {event?.description || "Aucune description disponible."}
          </p>
        </div>

        {/* Métadonnées avec design amélioré */}
        <div className="flex flex-col space-y-2.5 text-sm mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            <time dateTime={event?.date} className="font-medium">{formattedDate}</time>
          </div>
          
          {formattedTime && (
            <div className="flex items-center text-gray-700">
              <Clock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{formattedTime}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
            <address className="not-italic font-medium">
              {event?.location || "Lieu inconnu"}
            </address>
          </div>
        </div>

        {/* Bouton d'action redessiné */}
        <Link
          href={eventLink}
          className="inline-flex items-center justify-center w-full px-4 py-3 font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition-all shadow-sm group-hover:shadow-md"
          aria-label={`Voir les détails de ${event?.title || "cet événement"}`}
          prefetch={false}
        >
          <span>Voir les détails</span>
          <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}