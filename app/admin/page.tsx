"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/admin/header";
import { UploadForm } from "@/components/admin/upload-form";
import { Course } from "@/lib/data";

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuth");
    if (!isAuthenticated) {
      router.push("/admin/login");
    } else {
      fetchCourses();
    }
  }, [router]);

  const fetchCourses = async () => {
    const res = await fetch("/api/courses");
    const data = await res.json();
    setCourses(data.courses);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="container py-8">
      <Header onLogout={handleLogout} />
      <UploadForm courses={courses} />
    </div>
  );
}