'use client';

import { useState, useEffect, useCallback } from 'react';
import { MagnifyingGlassIcon, CalendarIcon, MapPinIcon, TagIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

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
    const [showFilters, setShowFilters] = useState(false);

    const cleanFilters = useCallback((filters) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value && value !== '')
        );
    }, []);

    // Obtenir le nombre de filtres actifs (hors recherche)
    const activeFilterCount = Object.entries(filters)
        .filter(([key, value]) => key !== 'search' && value && value !== '')
        .length;

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
        <div className="w-full max-w-6xl mx-auto transition-all duration-300">
            {/* Barre de recherche principale et bouton de filtre */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                {/* Bouton de filtre */}
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-all duration-200 relative"
                    aria-label="Afficher/Masquer les filtres"
                >
                    <FunnelIcon className="h-5 w-5" />
                    <span className="font-medium">Filtrer</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Champ de recherche */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        placeholder="Rechercher des événements..."
                        value={filters.search}
                        onChange={handleChange}
                        className="pl-10 pr-3 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        aria-label="Rechercher des événements"
                    />
                    {isTyping && (
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-500 text-xs animate-pulse">
                            Recherche...
                        </span>
                    )}
                </div>
            </div>

            {/* Panneau de filtres repliable */}
            {showFilters && (
                <div className="mt-2 p-4 bg-white rounded-lg border border-gray-200 shadow-md animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-700">Options de filtrage</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Fermer les filtres"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Filtre par date */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleChange}
                                    className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Filtrer par date"
                                />
                            </div>
                        </div>

                        {/* Filtre par lieu */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Ville ou lieu"
                                    value={filters.location}
                                    onChange={handleChange}
                                    className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    aria-label="Filtrer par lieu"
                                />
                            </div>
                        </div>

                        {/* Filtre par catégorie */}
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TagIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleChange}
                                    className="pl-10 w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                                    aria-label="Filtrer par catégorie"
                                >
                                    <option value="">Toutes catégories</option>
                                    <option value="concert">Concert</option>
                                    <option value="sport">Sport</option>
                                    <option value="theatre">Théâtre</option>
                                    <option value="exposition">Exposition</option>
                                    <option value="conference">Conférence</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres actifs et bouton de réinitialisation */}
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(filters).map(([key, value]) => 
                                key !== 'search' && value ? (
                                    <div key={key} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                                        {key === 'date' && 'Date:'}
                                        {key === 'location' && 'Lieu:'}
                                        {key === 'category' && 'Catégorie:'}
                                        <span className="font-medium ml-1">{value}</span>
                                        <button 
                                            onClick={() => setFilters(prev => ({ ...prev, [key]: '' }))}
                                            className="ml-2 text-blue-500 hover:text-blue-700"
                                            aria-label={`Supprimer le filtre ${key}`}
                                        >
                                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : null
                            )}
                        </div>
                        
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
                            aria-label="Réinitialiser les filtres"
                        >
                            <span>Réinitialiser</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}