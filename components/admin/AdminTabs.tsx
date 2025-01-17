import { useState } from 'react';
import { ConnectionsList } from './ConnectionsList';
import { UploadForm } from './upload-form';
import { courses as initialCourses, classes as initialClasses, Course, Classe } from "@/lib/data";

export function AdminTabs() {
  const [activeTab, setActiveTab] = useState<'connections' | 'upload'>('upload');
  const [courses, setCourses] = useState<Course[]>(initialCourses || []);
  const [classes, setClasses] = useState<Classe[]>(initialClasses || []);

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
            onClick={() => setActiveTab('upload')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Gestion
          </button>
          <button
            onClick={() => setActiveTab('connections')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Connexions
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'upload' && <UploadForm courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />}
        {activeTab === 'connections' && <ConnectionsList />}
      </div>
    </div>
  );
}