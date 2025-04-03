"use client";

import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import { fetchEvents } from "../lib/api";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";

export default function EventsPage() {
  const [data, setData] = useState({ events: [], total: 0 });
  const [filters, setFilters] = useState({});
  const [range, setRange] = useState([0, 8]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const result = await fetchEvents({ filters, range });
        console.log(result);
        setData(result);
      } catch (error) {
        console.error("Erreur de chargement:", error);
        setData({ events: [], total: 0 });
      } finally {
        setIsLoading(false);
      }
    }
    loadEvents();
  }, [filters, range]);

  const handlePageChange = (newPage) => {
    const itemsPerPage = range[1] - range[0] + 1;
    setRange([(newPage - 1) * itemsPerPage, newPage * itemsPerPage - 1]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Événements à venir
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <EventFilters onFilterChange={setFilters} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Aucun événement disponible pour le moment
                </p>
              </div>
            )}

            {data.total > 0 && (
              <div className="mt-8">
                <Pagination
                  totalItems={data.total}
                  itemsPerPage={range[1] - range[0] + 1}
                  currentPage={
                    Math.floor(range[0] / (range[1] - range[0] + 1)) + 1
                  }
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
