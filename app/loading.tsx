import React from 'react';
import './loading.css'; // Importer le fichier CSS pour les styles

export default function Loading() {
  return (
    <div className="loading-container py-8 text-center">
      <div className="spinner"></div>
      <h2 className="text-3xl font-bold mb-4">Chargement ...</h2>
    </div>
  );
}