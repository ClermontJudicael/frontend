'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, MapPinIcon, TagIcon } from '@heroicons/react/24/outline';

export default function EventFilters({ onFilterChange, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: '',
    category: '',
    ...initialFilters
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isTyping, setIsTyping] = useState(false);

  // Nettoyage des filtres vides
  const cleanFilters = useCallback((filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value && value !== '')
    );
  }, []);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  // Appel du callback quand les filtres changent
  useEffect(() => {
    const cleaned = cleanFilters(debouncedFilters);
    if (Object.keys(cleaned).length > 0 || Object.keys(cleanFilters(filters)).length === 0) {
      onFilterChange(cleaned);
    }
  }, [debouncedFilters, onFilterChange, cleanFilters, filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    if (name === 'search') setIsTyping(true);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      date: '',
      location: '',
      category: ''
    });
  };

  return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Champ de recherche */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                name="search"
                placeholder="Rechercher..."
                value={filters.search}
                onChange={handleChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Rechercher des événements"
            />
            {isTyping && (
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-xs">
              Recherche...
            </span>
            )}
          </div>

          {/* Filtre par date */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filtrer par date"
            />
          </div>

          {/* Filtre par lieu */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                name="location"
                placeholder="Lieu"
                value={filters.location}
                onChange={handleChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filtrer par lieu"
            />
          </div>

          {/* Filtre par catégorie */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                aria-label="Filtrer par catégorie"
            >
              <option value="">Toutes catégories</option>
              <option value="concert">Concert</option>
              <option value="sport">Sport</option>
              <option value="theatre">Théâtre</option>
              <option value="exposition">Exposition</option>
              <option value="conference">Conférence</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Réinitialiser les filtres"
          >
            Réinitialiser
          </button>
        </div>
      </div>
  );
}