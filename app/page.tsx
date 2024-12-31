"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import './globals.css'; // Importer le fichier CSS pour les styles globaux



export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 app-container">
      <div className="text-center space-y-6 max-w-2xl">
        <GraduationCap className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Plan de travail et activités</h1>
        <p className="text-xl text-muted-foreground">
          Site web de M. Sekrane
        </p>
        <Link href="/courses">
          <Button size="lg" className="mt-6">
            Voir les cours
          </Button>
        </Link>
      </div>
    </div>
  );
}