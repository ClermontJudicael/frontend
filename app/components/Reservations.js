"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Reservations = () => {
  const { user, token } = useAuth(); // Assuming you store the token in your AuthContext
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservations/my", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchReservations();
    }
  }, [user, token]);

  if (loading) {
    return <div>Loading reservations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>
      {reservations.length === 0 ? (
        <p className="text-gray-500">No reservations yet.</p>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="border p-4 rounded">
              <p><strong>Event:</strong> {reservation.title || "Event ID: " + reservation.event_id}</p>
              <p><strong>Ticket:</strong> {reservation.type || "Ticket ID: " + reservation.ticket_id}</p>
              <p><strong>Quantity:</strong> {reservation.quantity}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <p><strong>Amount:</strong> {reservation.amount ? reservation.amount + " €" : null}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
