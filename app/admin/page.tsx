"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Box, Container } from '@mui/material';
import { useState, useEffect } from 'react';
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        m: 2,
        mt: 6,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Header onLogout={handleLogout} />
      </Box>
      <Container maxWidth="lg" sx={{ mt: 2, p: 3 }}>
        <AdminTabs />
      </Container>
    </Box>
  );
}