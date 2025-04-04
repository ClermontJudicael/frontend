"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "profile", label: "Profil" },
  { id: "reservations", label: "Réservations" },
  { id: "receipts", label: "Reçus" },
];

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const ReservationCard = ({ reservation, refreshReservations }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const eventDate = new Date(reservation.event?.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-reservations/${reservation.id}/confirm`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) throw new Error('Échec de la confirmation');

      refreshReservations();
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
      <div className="p-4 bg-blue-50">
        <h3 className="text-xl font-semibold text-blue-800">{reservation.event?.title || 'Événement'}</h3>
        <p className="text-sm text-gray-500">{eventDate}</p>
      </div>
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Type de billet:</span>
          <span className="text-gray-500">{reservation.ticket?.type || 'N/A'}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Quantité:</span>
          <span className="text-gray-500">{reservation.quantity}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Prix total:</span>
          <span className="text-gray-500">€{(reservation.ticket?.price * reservation.quantity).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Statut:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            reservation.status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {reservation.status}
          </span>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Lieu:</span> {reservation.event?.location || 'Inconnu'}
          </p>
        </div>
      </div>

      {reservation.status === 'pending' && (
        <div className="p-4 bg-yellow-50 border-t">
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`w-full py-2 px-4 rounded ${
              isConfirming 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConfirming ? 'Confirmation...' : 'Confirmer la réservation'}
          </button>
        </div>
      )}
    </div>
  );
};

const Reservations = ({ reservations, loading, refreshReservations }) => {
  if (loading) return <LoadingSpinner />;

  const confirmed = reservations.filter(r => r.status === "confirmed");
  const pending = reservations.filter(r => r.status === "pending");

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-500 font-semibold">Réservations confirmées</h2>
          <button
            onClick={refreshReservations}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Actualiser
          </button>
        </div>
        {confirmed.length === 0 ? (
          <p className="text-gray-500">Aucune réservation confirmée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmed.map((r) => (
              <ReservationCard key={r.id} reservation={r} refreshReservations={refreshReservations} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl text-gray-500 font-semibold mb-4">Réservations en attente</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">Aucune réservation en attente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((r) => (
              <ReservationCard key={r.id} reservation={r} refreshReservations={refreshReservations} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Receipts = ({ receipts, loading }) => {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-xl text-gray-500 font-semibold mb-4">Mes reçus</h2>
      {receipts.length === 0 ? (
        <p className="text-gray-500">Aucun reçu trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receipts.map((receipt) => (
            <div key={receipt.id} className="border rounded-lg p-4 bg-white shadow-md">
              <h3 className="text-lg font-bold text-blue-600 mb-2">Reçu #{receipt.id}</h3>
              <p className="text-gray-600">Montant: <strong>{receipt.amount} €</strong></p>
              <p className="text-gray-600">Méthode de paiement: {receipt.payment_method}</p>
              <p className="text-gray-600">Statut: <span className="text-green-600">{receipt.payment_status}</span></p>
              <p className="text-gray-600">Date: {new Date(receipt.issued_at).toLocaleString("fr-FR")}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-400">QR Code:</p>
                <img src={receipt.qr_code} alt="QR Code" className="w-20 h-20" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Profile = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl text-gray-500 font-semibold mb-4">Détails du profil</h2>
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div>
        <p className="text-lg font-semibold">{user.username}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

  const [receipts, setReceipts] = useState([]);
  const [receiptsLoading, setReceiptsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  useEffect(() => {
    if (activeTab === "reservations" && user) {
      fetchReservations();
    } else if (activeTab === "receipts" && user) {
      fetchReceipts();
    }
  }, [activeTab, user]);

  const fetchReservations = async () => {
    try {
      setReservationsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-reservations/my-reservations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des réservations");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error(error);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  const fetchReceipts = async () => {
    try {
      setReceiptsLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/receipts/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error("Erreur lors du chargement des reçus");
      const data = await res.json();
      setReceipts(data);
    } catch (error) {
      console.error(error);
      setReceipts([]);
    } finally {
      setReceiptsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  }

  return (
    <div className="flex h-screen bg-[#EEF2FF]">
      <aside className="w-64 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold mb-4 text-blue-600">Dashboard</h1>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full text-left p-2 my-1 rounded-lg transition ${
                activeTab === item.id ? "bg-blue-500 text-white" : "text-black hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "reservations" && (
          <Reservations 
            reservations={reservations} 
            loading={reservationsLoading} 
            refreshReservations={fetchReservations}
          />
        )}
        {activeTab === "receipts" && (
          <Receipts 
            receipts={receipts}
            loading={receiptsLoading}
          />
        )}
      </main>
    </div>
  );
}
