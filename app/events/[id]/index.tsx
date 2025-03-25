// pages/articles/[id]/index.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import React from 'react';

type Article = {
  id: number;
  titre: string;
  contenu: string;
  date: string;
  user_id: number;
  lienImage?: string;
};

const ArticleDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:4000/articles/${id}`)
        .then((res) => res.json())
        .then((data) => setArticle(data))
        .catch((err) => console.error("Erreur lors du chargement de l'article", err));
    }
  }, [id]);

  if (!article) return <p>Chargement...</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">{article.titre}</h1>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Retour
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {article.lienImage && (
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <Image
              src={article.lienImage}
              alt={article.titre}
              layout="responsive"
              width={800}
              height={600}
              className="rounded-lg shadow-lg"
            />
          </div>
        )}

        <div className="lg:w-1/2">
          <p className="text-gray-700 text-lg">{article.contenu}</p>
          <p className="mt-4 text-sm text-gray-500">{`Publié le: ${article.date}`}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
