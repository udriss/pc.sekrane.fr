'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { courses as initialCourses, Course } from "@/lib/data";
import { Header } from "@/components/admin/header";
import { UploadForm } from "@/components/admin/upload-form";

export default function AdminPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuth");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="container py-8">
      <Header onLogout={handleLogout} />
      <UploadForm courses={courses} setCourses={setCourses} />
    </div>
  );
}