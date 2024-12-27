import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plan de travail et activités',
  description: 'Accédez à vos cours et activités',
};

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} transition-colors duration-300 bg-white dark:bg-gray-900`}>
        {children}
      </body>
    </html>
  );
}