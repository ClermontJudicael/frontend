import { Pool } from 'pg';

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

export default async function handler(req, res) {
    // 1. Définir le header Content-Type
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.query;

    try {
        if (!id || isNaN(Number(id))) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        // 3. Requête à la base de données
        const eventQuery = await pool.query(
            `SELECT e.*, u.username as organizer_name 
       FROM events e
       JOIN users u ON e.organizer_id = u.id
       WHERE e.id = $1`,
            [id]
        );

        if (eventQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Événement non trouvé' });
        }

        const ticketsQuery = await pool.query(
            `SELECT * FROM tickets 
       WHERE event_id = $1 
       AND is_active = TRUE 
       AND available_quantity > 0`,
            [id]
        );

        // 4. Renvoyer le JSON correctement formaté
        return res.status(200).json({
            success: true,
            event: eventQuery.rows[0],
            tickets: ticketsQuery.rows
        });

    } catch (error) {
        console.error('Database error:', error);
        // 5. Toujours renvoyer du JSON même en cas d'erreur
        return res.status(500).json({
            success: false,
            error: 'Erreur serveur'
        });
    }
}