import Image from "next/image";
import Link from "next/link";
import React from "react";

const getData = async () => {
  const res = await fetch("http://localhost:4000/articles");
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des articles");
  }
  return res.json();
};

type Article = {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  user_id: number;
  lienImage?: string;
};

export default async function Home() {
  let articles: Article[] = [];
  try {
    articles = await getData();
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Bienvenue à tout le monde</h2>

      {/* Barre de recherche et Sélecteur d'options */}
      <div className="mb-6 flex items-center justify-center space-x-4">
        {/* Icône de recherche */}
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Rechercher..."
            className="p-3 pl-10 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M13.745 12.743a8 8 0 1 0-1.414 1.414l3.979 3.979a1 1 0 0 0 1.414-1.414l-3.979-3.979zM14 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Sélecteur d'options */}
        <select
          id="category"
          name="category"
          className="p-3 w-56 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-200"
        >
          <option value="sport">Sport</option>
          <option value="alliance_francaise">Alliance Française</option>
          <option value="mariage">Mariage</option>
        </select>
      </div>

      {/* Grille d'articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {articles.length > 0 ? (
          articles.map((article: Article) => (
            <div
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
              key={article.id}
            >
              <figure className="w-full h-48 overflow-hidden">
                {article.lienImage && (
                  <Image
                    src={article.lienImage}
                    alt={article.titre}
                    layout="responsive"
                    width={459}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                )}
              </figure>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{article.titre}</h3>
                <p className="text-gray-500 mt-2">{article.contenu.substring(0, 100)}...</p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-5 h-5 ${index < 3 ? "text-yellow-400" : "text-gray-300"}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15l-5.6 3.3 1.2-6.5-4.8-4.7 6.6-.5L10 1l2.4 6.6 6.6.5-4.8 4.7 1.2 6.5L10 15z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <Link href={`/articles/${article.id}`} className="text-blue-500 hover:underline">
                    Voir les détails
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500 text-xl">Aucun article disponible.</p>
        )}
      </div>

      {/* Bouton d'ajout d'article */}
      <Link
        href="/dashboard"
        className="mt-8 inline-block bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200 ease-in-out"
      >
        Ajouter un article
      </Link>
    </main>
  );
}
