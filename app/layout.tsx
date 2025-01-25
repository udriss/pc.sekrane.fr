import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

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
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <body className={`${inter.className} min-h-screen w-full`}>
            <div className="max-w-[800px] mx-auto w-full">
              <MainNav />
            </div>
          <main className="w-full min-w-[320px] min-h-screen">
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

