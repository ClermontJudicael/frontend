"use client";

import { useState, useEffect, useCallback } from "react";
import EventFilters from "./components/EventFilters";
import debounce from "lodash/debounce";
import { lastEvents } from "./lib/api";
import EventCard from "./components/EventCard";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await lastEvents();
        setEvents(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setEvents([]); // Réinitialiser en cas d'erreur
      }
    }
    loadEvents();
  }, [filters]);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
               Bienvenue sur Tapakila
           </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {events && events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="col-span-full text-center text-gray-500 mt-8">
              Aucun événement trouvé
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
