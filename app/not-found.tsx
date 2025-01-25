'use client';

import { useEffect, useState } from 'react';
import { BookX, School, GraduationCap, FileQuestion } from 'lucide-react';

function NotFoundContent() {
  return (
    <div className="container mt-16 py-8 text-center min-h-screen flex flex-col items-center justify-start">
      <div className="animate-bounce-slow mb-8 flex gap-4">
        <School className="w-12 h-12 text-primary animate-pulse" />
        <BookX className="w-12 h-12 text-destructive" />
        <GraduationCap className="w-12 h-12 text-primary animate-pulse" />
        <FileQuestion className="w-12 h-12 text-muted-foreground animate-pulse" />
      </div>
      <h2 className="text-4xl font-bold mb-4 text-primary">404 - Page introuvable</h2>
      <p className="text-xl text-muted-foreground">
        La page recherchée n&apos;existe pas ou a été déplacée.
      </p>
    </div>
  );
}

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="loading-container mt-16 text-center">
        <div className="spinner"></div>
        <h2 className="text-3xl font-bold mb-4">Chargement ...</h2>
      </div>
    );
  }

  return <NotFoundContent />;
}

// Add this to your global.css or equivalent
// @keyframes bounce-slow {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-20px); }
// }
// 
// .animate-bounce-slow {
//   animation: bounce-slow 3s infinite;
// }