import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav } from '@/components/main-nav';
import { ChartProvider } from '@/contexts/ChartContext';
import { CarouselProvider } from '@/contexts/CarouselContext';
import { FormProvider } from '@/contexts/FormContext';
import { ToggleGroupProvider } from '@/contexts/ToggleGroupContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plan de travail et activités',
  description: 'Accédez à vos cours et activités',
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
          <main>{children}</main>
      </body>
    </html>
  );
}