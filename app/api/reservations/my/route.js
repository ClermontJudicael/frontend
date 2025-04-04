import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Fetch user reservations from your backend API
        const res = await fetch(`${process.env.BACKEND_URL}/api/reservations/my`, {
            method: 'GET',
            headers: {
                'Authorization': req.headers.get('Authorization'), // Forward auth token
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
