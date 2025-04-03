"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Inscription() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Échec de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#EEF2FF]">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl text-blue-600 font-semibold text-center">Inscription</h2>
        <p className="text-gray-500 text-center mb-4">Créez un compte</p>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              placeholder="Votre nom d'utilisateur"
              onChange={handleChange}
              required
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700">Adresse e-mail</label>
            <input
              type="email"
              name="email"
              placeholder="exemple@gmail.com"
              onChange={handleChange}
              required
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Entrez votre mot de passe"
              onChange={handleChange}
              required
              className="w-full border text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              onChange={handleChange}
              required
              className="w-full text-black border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            S'inscrire
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Vous avez déjà un compte ? <a href="/login" className="text-blue-600 font-semibold hover:underline">Connectez-vous</a>
        </p>
      </div>
    </div>
  );
}
