'use client';

import { useState, useEffect, useCallback } from 'react';

export default function EventFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: '',
    category: ''
  });

  // Utiliser useCallback pour mémoriser la fonction de nettoyage
  const cleanFilters = useCallback((filters) => {
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '' && value !== 'null')
    );
  }, []);

  // Gérer les changements avec un délai pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = cleanFilters(filters);
      if (Object.keys(clean).length > 0) {
        onFilterChange(clean);
      }
    }, 3000); // Délai de 500ms

    return () => clearTimeout(timer);
  }, [filters, onFilterChange, cleanFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <input
            type="text"
            name="search"
            placeholder="Rechercher un événement..."
            value={filters.search}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <input
            type="text"
            name="location"
            placeholder="Lieu"
            value={filters.location}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Toutes les catégories</option>
            <option value="concert">Concert</option>
            <option value="sport">Sport</option>
            <option value="theatre">Théâtre</option>
            <option value="exposition">Exposition</option>
          </select>
        </div>
      </div>
    </div>
  );
} 