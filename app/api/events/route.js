import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // 1. Préparation des paramètres
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams.entries());

    // 2. Construction de l'URL de l'API backend
    const backendUrl = new URL(
        `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/events`
    );

    // 3. Ajout des paramètres de filtre
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'undefined') {
        backendUrl.searchParams.append(key, value);
      }
    });

    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 } // Cache pendant 60 secondes
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: await response.text() };
      }
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    // 6. Traitement de la réponse
    const data = await response.json();
    const results = Array.isArray(data) ? data : data.events || [data];

    // 7. Retour de la réponse
    return NextResponse.json(results, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });

  } catch (error) {
    console.error('[API Error]', error.message);
    return NextResponse.json(
        {
          error: error.message || 'Erreur serveur',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: error.status || 500 }
    );
  }
}