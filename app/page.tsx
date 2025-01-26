"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from 'react';
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import './globals.css'; // Importer le fichier CSS pour les styles globaux
import { generateFingerprint } from '@/lib/fingerprint';

export default function Home() {
  const initialized = useRef(false);

  const initFingerprint = async () => {
    if (initialized.current) return;
    
    try {
      const deviceId = await generateFingerprint();
      localStorage.setItem('deviceFingerprint', deviceId);
      initialized.current = true;
    } catch (error) {
      console.error('Error generating fingerprint:', error);
    }
  };
  
  useEffect(() => {
    initFingerprint();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-4rem)] app-container">
      <div className="text-center space-y-6 max-w-2xl">
        <GraduationCap className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Plan de travail et activités</h1>
        <p className="text-xl text-muted-foreground">
          Accédez à vos cours et activités en SPC et SNT
        </p>

        <p className="text-xl text-muted-foreground mt-6">
          Site web de M. <span className="small-caps">Sekrane</span> <br />
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