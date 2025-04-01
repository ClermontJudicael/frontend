import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      date: searchParams.get('date'),
      location: searchParams.get('location'),
      category: searchParams.get('category'),
      search: searchParams.get('search')
    };

    console.log('Filtres reçus:', filters);
    console.log('URL de l\'API:', `${process.env.NEXT_PUBLIC_API_URL}/api/events`);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?${new URLSearchParams(filters)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erreur de réponse:', response.status, errorData);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorData.message || 'Erreur serveur'}`);
    }

    const data = await response.json();
    console.log('Réponse du backend:', data);

    // Si data n'est pas un tableau, on le convertit en tableau
    const events = Array.isArray(data) ? data : [data];
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erreur dans la route API:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
} 