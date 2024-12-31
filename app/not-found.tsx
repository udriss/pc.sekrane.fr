// app/not-found.tsx
'use client';

import { useEffect, useState } from 'react';

function NotFoundContent() {
  return (
    <div className="container py-8 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Page non trouvée</h2>
      <p className="text-muted-foreground">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
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
      <div className="container py-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Chargement.................</h2>
      </div>
    );
  }

  return <NotFoundContent />;
}