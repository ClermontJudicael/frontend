"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth for authentication

export default function Dashboard() {
  const { user } = useAuth(); // Get user info from AuthContext
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Loading state for the initial check

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
      <p className="text-xl mb-4">Hello, {user.username}!</p> {/* Display username */}
      <p className="text-lg">This is your personalized dashboard.</p>
      {/* You can add more personalized content here */}
    </div>
  );
}
