import React from 'react';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="text-white rounded-[20px] headerAdmin grid grid-cols-5">
        <div className='col-span-3 flex items-center justify-center'>
          <h1 className="text-xl font-bold">Panneau admin</h1>
        </div>
        <div className="col-span-2 flex justify-center">
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Déconnexion
          </button>
        </div>
    </header>
  );
}