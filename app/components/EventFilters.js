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

    const cleanFilters = useCallback((filters) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value && value !== '')
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters(filters);
            setIsTyping(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [filters]);

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
        <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Champ de recherche - Magnifique */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:-translate-y-1">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="Rechercher un événement..."
                        value={filters.search}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                        aria-label="Rechercher des événements"
                    />
                    {isTyping && (
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 text-xs animate-pulse">
                            Recherche...
                        </span>
                    )}
                </div>

                {/* Filtre par date - Élégant */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:-translate-y-1">
                        <CalendarIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 appearance-none"
                        aria-label="Filtrer par date"
                    />
                </div>

                {/* Filtre par lieu - Sophistiqué */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:-translate-y-1">
                        <MapPinIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                        type="text"
                        name="location"
                        placeholder="Ville ou lieu"
                        value={filters.location}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300"
                        aria-label="Filtrer par lieu"
                    />
                </div>

                {/* Filtre par catégorie - Chic */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-200 group-focus-within:-translate-y-1">
                        <TagIcon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 appearance-none bg-white"
                        aria-label="Filtrer par catégorie"
                    >
                        <option value="">Toutes catégories</option>
                        <option value="concert">Concert</option>
                        <option value="sport">Sport</option>
                        <option value="theatre">Théâtre</option>
                        <option value="exposition">Exposition</option>
                        <option value="conference">Conférence</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Bouton de réinitialisation - Élégant */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleReset}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 flex items-center space-x-1 border border-gray-200 hover:border-gray-300"
                    aria-label="Réinitialiser les filtres"
                >
                            <span>Réinitialiser</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>
        </div>
    );
}