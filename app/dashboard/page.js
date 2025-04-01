"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { id: "profile", label: "Profile" },
  { id: "reservations", label: "Reservations" },
];

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/user-reservations/my-reservations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
        // Remove credentials: 'include' unless you specifically need cookies
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reservations: ${response.status}`);
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
    <div className="flex h-screen bg-gray-100">
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

const Profile = ({ user }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
      <div>
        <p className="text-lg font-semibold">{user.username}</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
    </div>
  </div>
);

const Reservations = ({ reservations, loading, refreshReservations }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Reservations</h2>
        <button
          onClick={refreshReservations}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh
        </button>
      </div>
      
      {reservations.length === 0 ? (
        <p className="text-gray-500">No reservations yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
};

const ReservationCard = ({ reservation }) => {
  const eventDate = new Date(reservation.event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <div className="p-4 bg-blue-50">
        <h3 className="text-xl font-semibold text-blue-800">{reservation.event.title}</h3>
        <p className="text-sm text-gray-600">{eventDate}</p>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Ticket Type:</span>
          <span>{reservation.ticket.type}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium">Quantity:</span>
          <span>{reservation.quantity}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total Price:</span>
          <span>${(reservation.ticket.price * reservation.quantity).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${
            reservation.status === 'confirmed' 
              ? 'bg-green-100 text-green-800' 
              : reservation.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-red-100 text-red-800'
          }`}>
            {reservation.status}
          </span>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {reservation.event.location}
          </p>
        </div>
      </div>
    </div>
  );
};