"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "profile", label: "Profile" },
  { id: "reservations", label: "Reservations" },
];

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Reservation Card Component
const ReservationCard = ({ reservation, refreshReservations }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const eventDate = new Date(reservation.event?.date).toLocaleDateString('en-US', {
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

      if (!response.ok) throw new Error('Failed to confirm reservation');
      
      refreshReservations();
    } catch (error) {
      console.error('Confirmation error:', error);
      alert(error.message);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
  // Dans ReservationCard
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition bg-white">
      <div className="p-4 bg-blue-50">
        <h3 className="text-xl font-semibold text-blue-800">{reservation.event?.title || 'Event'}</h3>
        <p className="text-sm text-gray-500">{eventDate}</p> {/* Appliquer text-gray-500 ici */}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Ticket Type:</span> {/* Utiliser text-gray-500 */}
          <span className="text-gray-500">{reservation.ticket?.type || 'N/A'}</span> {/* Idem */}
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Quantity:</span>
          <span className="text-gray-500">{reservation.quantity}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Total Price:</span>
          <span className="text-gray-500">${(reservation.ticket?.price * reservation.quantity).toFixed(2) || '0.00'}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium text-gray-500">Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            reservation.status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {reservation.status}
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-500"> {/* Utiliser text-gray-500 ici aussi */}
            <span className="font-medium">Location:</span> {reservation.event?.location || 'Unknown'}
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
            {isConfirming ? 'Confirming...' : 'Confirm Reservation'}
          </button>
        </div>
      )}
    </div>


  );
};

// Reservations Component
const Reservations = ({ reservations, loading, refreshReservations }) => {
  if (loading) return <LoadingSpinner />;

  const confirmedReservations = reservations.filter(
    (r) => r.status === "confirmed"
  );
  const pendingReservations = reservations.filter(
    (r) => r.status === "pending"
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-gray-500 font-semibold">Reservation confirmées</h2>
          <button
            onClick={refreshReservations}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Actualiser
          </button>
        </div>
        {confirmedReservations.length === 0 ? (
          <p className="text-gray-500">Aucun reservation confirmée.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmedReservations.map((reservation) => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation}
                refreshReservations={refreshReservations}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl text-gray-500 font-semibold mb-4">Reservation en attentes</h2>
        {pendingReservations.length === 0 ? (
          <p className="text-gray-500">Aucun reservation en attente.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingReservations.map((reservation) => (
              <ReservationCard 
                key={reservation.id} 
                reservation={reservation}
                refreshReservations={refreshReservations}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Component
const Profile = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl text-gray-500 font-semibold mb-4">Detail du profile</h2>
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div>
        <p className="text-lg font-semibold">{user.username}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [reservations, setReservations] = useState([]);
  const [reservationsLoading, setReservationsLoading] = useState(false);

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
    }
  }, [activeTab, user]);

  const fetchReservations = async () => {
    try {
      setReservationsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user-reservations/my-reservations`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservations([]);
    } finally {
      setReservationsLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#EEF2FF]">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "reservations" && (
          <Reservations 
            reservations={reservations} 
            loading={reservationsLoading} 
            refreshReservations={fetchReservations}
          />
        )}
      </main>
    </div>
  );
}