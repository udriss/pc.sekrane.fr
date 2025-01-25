import React from 'react';
import { ModificationsAdmin } from '@/components/admin/admin-corruption';
import { GenerationsAdmin } from '@/components/admin/admin-generation';
import { Course, Classe } from '@/lib/data';

interface UploadFormProps {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  classes: Classe[];
  setClasses: (classes: Classe[]) => void;
}

export function UploadForm({ courses, setCourses, classes, setClasses }: UploadFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4 min-w-[1200px]">
      <div className="w-full">
        <ModificationsAdmin courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />
      </div>
      <div className="w-full">
        <GenerationsAdmin courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />
      </div>
    </div>
  );
}