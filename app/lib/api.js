<<<<<<< HEAD
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Récupère la liste des événements avec filtres optionnels
 * @param {Object} filters - Les filtres de recherche
 * @returns {Promise<Array>} Liste des événements
 */
export async function fetchEvents(filters = {}) {
  const url = new URL(`${API_BASE_URL}/api/events`);
  console.log("URL");
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Échec du chargement des événements"
      );
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export async function fetchEvents({ filters = {}, range = [0, 8] } = {}) {
    const url = new URL(`${API_BASE_URL}/api/events/filter/by-status`);
    
    // Ajoute les paramètres de requête
    url.searchParams.append('filter', JSON.stringify({
        ...filters,
        status: 'published' // Toujours forcer published pour le front public
    }));
    url.searchParams.append('range', JSON.stringify(range));

    try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Échec du chargement des événements');
        }

        const events = await response.json();
        const total = parseInt(response.headers.get('X-Total-Count') || events.length);
        
        return { events, total };
    } catch (error) {
        console.error('Erreur dans fetchEvents:', error);
        throw error;
>>>>>>> eca68c9a7e6b611680b6b441e30f47d15a0ace4b
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchEvents:", error);
    throw error;
  }
}

/**
 * Récupère les 3 derniers des événements avec filtres optionnels
 * @returns {Promise<Array>} Liste des événements
 */
export async function lastEvents() {
  const url = new URL(`${API_BASE_URL}/api/events/last-date`);
  console.log("URL");

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Échec du chargement des événements"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans fetchEvents:", error);
    throw error;
  }
}
/**
 * Récupère un événement spécifique par son ID
 * @param {string} id - ID de l'événement
 * @returns {Promise<Object>} Détails de l'événement
 */
export async function fetchEventById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Événement non trouvé (${response.status})`
      );
    }

    const event = await response.json();
    return event; // Retourne directement l'événement
  } catch (error) {
    console.error("Erreur fetchEventById:", error);
    throw error;
  }
}

/**
 * Crée un nouvel événement
 * @param {Object} eventData - Données de l'événement
 * @returns {Promise<Object>} Événement créé
 */
export async function createEvent(eventData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la création");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans createEvent:", error);
    throw error;
  }
}

/**
 * Crée une réservation pour un événement
 * @param {Object} reservationData - Données de réservation
 * @returns {Promise<Object>} Réservation créée (avec QR code)
 */
export async function createReservation(reservationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(reservationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la réservation");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans createReservation:", error);
    throw error;
  }
}

/**
 * Traite un paiement pour une réservation
 * @param {Object} paymentData - Données de paiement
 * @returns {Promise<Object>} Résultat du paiement
 */
export async function processPayment(paymentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Paiement échoué");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans processPayment:", error);
    throw error;
  }
}

/**
 * Met à jour un événement existant
 * @param {string} id - ID de l'événement
 * @param {Object} updateData - Données de mise à jour
 * @returns {Promise<Object>} Événement mis à jour
 */
export async function updateEvent(id, updateData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Échec de la mise à jour");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans updateEvent:", error);
    throw error;
  }
}

export async function fetchEventTickets(eventId) {
    try {
        if (!eventId) {
            throw new Error("L'ID de l'événement est manquant !");
        }

        const parsedId = Number(eventId); // Convertit correctement en nombre

        if (isNaN(parsedId) || !Number.isInteger(parsedId)) {
            console.error("ID invalide reçu:", eventId, typeof eventId);
            throw new Error("L'ID de l'événement doit être un nombre entier valide");
        }

        const response = await fetch(`${API_BASE_URL}/api/events/${parsedId}/tickets`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Erreur ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erreur fetchEventTickets:", error);
        throw error;
    }
}


export default {
<<<<<<< HEAD
  fetchEvents,
  fetchEventById,
  createEvent,
  createReservation,
  processPayment,
  updateEvent,
};
=======
    fetchEvents,
    fetchEventById,
    createEvent,
    createReservation,
    processPayment,
    updateEvent,
    fetchEventTickets,
};
>>>>>>> eca68c9a7e6b611680b6b441e30f47d15a0ace4b
