import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      date: searchParams.get('date'),
      location: searchParams.get('location'),
      category: searchParams.get('category'),
      search: searchParams.get('search'),
    };

    // Vérifie si l'URL de l'API est définie
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_API_URL est undefined. Vérifiez votre fichier .env.local.');
    }

    console.log('URL de l\'API:', `${apiUrl}/api/events`);

    const response = await fetch(`${apiUrl}/api/events?${new URLSearchParams(filters)}`, {
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

    return NextResponse.json(Array.isArray(data) ? data : [data]);

  } catch (error) {
    console.error('Erreur dans la route API:', error);
    return NextResponse.json(
      { message: error.message || 'Erreur lors de la récupération des événements' },
      { status: 500 }
    );
  }
}
