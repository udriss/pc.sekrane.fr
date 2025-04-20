"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadForm } from '@/components/admin/upload-form';
import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SortableFile } from '@/components/admin/SortableFile';
import { 
  FileUpload as Upload, 
  KeyboardReturn as ArrowLeft, 
  Warning as AlertCircle 
} from '@mui/icons-material';
import { Header } from "@/components/admin/admin-header";
import { courses as initialCourses, classes as initialClasses, Course, Classe } from "@/lib/data";
import { AdminTabs } from '@/components/admin/AdminTabs';


export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses || []);
  const [classes, setClasses] = useState<Classe[]>(initialClasses || []);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => setCourses(data.courses));
  }, []);

  useEffect(() => {
    fetch('/api/courses')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setClasses(data.classes); 
      });
  }, []);
  
  useEffect(() => {
    const isAuthenticated = document.cookie.includes("adminAuth");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Force reload and redirect
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center m-8">
      <br></br>
      <div className="w-full max-w-[400px]">
        <Header onLogout={handleLogout} />
      </div>
      <br></br>
      <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Administration</h1>
      <AdminTabs />
    </div>
    </div>
  );
}