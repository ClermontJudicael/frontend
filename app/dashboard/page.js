"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth for authentication

const menuItems = [
  { id: "profile", label: "Profile" },
  { id: "reservations", label: "Reservations" },
];

export default function Dashboard() {
  const { user } = useAuth(); // Get user info from AuthContext
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Loading state for the initial check
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!user) {
      // If there's no user in context (i.e., not logged in), redirect to login
      router.push("/login");
    } else {
      setLoading(false); // Set loading to false once we confirm the user is authenticated
    }
  }, [user, router]);

  console.log(user);

  if (loading) {
    // Optionally show a loading spinner or placeholder while redirecting
    return <div>Loading...</div>;
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
      <main className="flex-1 p-6">
        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "reservations" && <Reservations />}
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

const Reservations = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Your Reservations</h2>
    <p className="text-gray-500">No reservations yet.</p>
  </div>
);
