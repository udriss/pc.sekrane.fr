import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plan de travail et activités',
  description: 'Site web de M. SEKRANE. Accédez à vos cours et activités en SPC et SNT.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <header className="border-b">
            <div className="container flex h-16 mx-auto px-4">
              <MainNav />
            </div>
          </header>
          <main>
            {children}
            <Toaster 
              position="top-center" 
              reverseOrder={false} 
              gutter={8}
              toastOptions={{
                duration: 1500,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
            <ToastContainer
              position="top-center"
              autoClose={false}
              closeOnClick
              pauseOnHover
              limit={3}
              theme="dark"
          />
          </main>
      </body>
    </html>
  );
}

