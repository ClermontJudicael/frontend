'use client';

import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { fetchEvents } from '../lib/api';
import { useState, useEffect } from 'react';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await fetchEvents(filters);
                setEvents(data);
            } catch (error) {
                console.error("Erreur de chargement:", error);
                setEvents([]); // Réinitialiser en cas d'erreur
            }
        }
        loadEvents();
    }, [filters]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Événements à venir</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <EventFilters onFilterChange={setFilters} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Aucun événement disponible pour le moment</p>
                    </div>
                )}
            </main>
        </div>
    );
}