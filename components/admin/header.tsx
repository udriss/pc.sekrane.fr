"use client";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Administration</h1>
      <Button variant="outline" onClick={onLogout}>
        Déconnexion
      </Button>
    </div>
  );
}