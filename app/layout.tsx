import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Container } from '@mui/material';
import ClientRequestHeaders from '@/components/ClientRequestHeaders';

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


export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen w-full`}>
        <Container maxWidth="xl" sx={{ width: '100%', mt: 2 }}>
          <MainNav />
        </Container>
        <Box
          component="main"
          sx={{
            mt: 4,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: { xs: '100%', md: 750, lg: 960, xl: 1300 },
            mx: 'auto',
            px: { xs: 2, md: 0 }
          }}
        >
          <ClientRequestHeaders />
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
        </Box>
      </body>
    </html>
  );
}

