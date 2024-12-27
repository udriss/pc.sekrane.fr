"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/admin/admin-header";
import { UploadForm } from "@/components/admin/upload-form";
import { courses as initialCourses, classes as initialClasses, Course, Classe } from "@/lib/data";

export default function AdminPage() {
  const [courses, setCourses] = useState<Course[]>(initialCourses || []);
  const [classes, setClasses] = useState<Classe[]>(initialClasses || []);
  const router = useRouter();

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
    <div className="min-h-screen flex flex-col items-center justify-center m-8">
      <br></br>
      <div className="w-full max-w-[600px]">
        <Header onLogout={handleLogout} />
      </div>
      <br></br>
      <div className="flex-grow flex justify-center items-center w-full min-w-[1200px]  m-4">
          <UploadForm courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />
      </div>
    </div>
  );
}