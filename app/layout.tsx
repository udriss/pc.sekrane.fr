import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });
const deploymentDomain = process.env.NEXT_PUBLIC_DEPLOYMENT_DOMAIN || 'http://localhost:8001';

export const metadata: Metadata = {
  title: 'Plan de travail et activités',
  description: 'Site web de M. SEKRANE. Accédez à vos cours et activités en SPC et SNT',
  icons: {
    icon: '/images/favicon.ico',
  },
  keywords: ['cours', 'physique', 'chimie', 'SPC', 'optique', 'Python',
     'SNT', 'informatique', 'programmation', 'algorithmique', 'éducation',
      'apprentissage', 'exercices', 'enseignant', 'élèves', 'sciences', 'technologie'],
  openGraph: {
    title: 'Plan de travail et activités',
    description: 'Site web de M. SEKRANE. Accédez à vos cours et activités en SPC et SNT',
    images: [
      '/images/ogImages/imageOG_1.jpeg',
      '/images/ogImages/imageOG_2.jpeg',
      '/images/ogImages/imageOG_3.jpeg',
      '/images/ogImages/imageOG_4.jpeg',
      '/images/ogImages/imageOG_5.jpeg',
      '/images/ogImages/imageOG_6.jpeg',
      '/images/ogImages/imageOG_7.jpeg',
      '/images/ogImages/imageOG_8.jpeg'
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  robots: 'index, follow',
  formatDetection: {
    telephone: false
  },
  metadataBase: new URL(deploymentDomain),
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <Head>
        <link rel="icon" href="/images/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      </Head>
      <body className={`${inter.className} min-h-screen w-full`}>
            <div className="max-w-[800px] mx-auto w-full">
              <MainNav />
            </div>
          <main className="container mt-32 min-h-screen flex flex-col w-full md:max-w-[750px] 
          lg:max-w-[960px] xl:max-w-[1300px] mx-auto px-4 md:px-0">
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

