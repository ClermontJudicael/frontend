"use client";

import { useState, useEffect } from "react";
import { lastEvents } from "./lib/api";
import EventCard from "./components/EventCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await lastEvents();
        
        if (!Array.isArray(data)) {
          throw new Error("Format de données inattendu");
        }

        setEvents(data);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setError("Impossible de charger les événements");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     <div></div> 
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Nouvelle section Hero inspirée de l'image */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="block"> Bienvenue sur Tapakila</span>
            <span className="block">Pour Tous Vos</span>
            <span className="block text-blue-600">Événements Préférés</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Tapakila est une plateforme innovante de gestion de billets d’événements, permettant aux utilisateurs d’acheter, vendre et réserver des tickets en toute simplicité. Que ce soit pour un match de football, une séance de cinéma, un concert ou une soirée spéciale, Tapakila offre une expérience fluide et sécurisée. Grâce à une interface moderne et intuitive,
             
          </p>
        </div>

        {/* Zone de recherche améliorée */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un événement"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
          </div>
        </div>

        {/* Grille d'événements */}
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Événements à venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full bg-white p-8 rounded-lg shadow-sm text-center">
                <p className="text-gray-500">Aucun événement disponible pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}