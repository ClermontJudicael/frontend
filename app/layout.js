import './globals.css';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext'; 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tapakila - Système de Gestion de Billetterie Événementielle',
  description: 'Réservez facilement vos billets pour les meilleurs événements',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>  {/* Wrap with AuthProvider */}
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
