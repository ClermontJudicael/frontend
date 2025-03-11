"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext"; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); //Get user and logout function

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Tapakila
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Accueil
            </Link>
            <Link href="/events" className="text-gray-600 hover:text-blue-600 transition-colors">
              Événements
            </Link>

            {/* ✅ Show different buttons based on login state */}
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Connexion
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link href="/" className="block text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
            <Link href="/events" className="block text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Événements
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={logout} className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block text-gray-600 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Inscription
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
