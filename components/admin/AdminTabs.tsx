import React, { useEffect, useState } from 'react';
import { ConnectionsList } from './ConnectionsList';
import { UploadForm } from './upload-form';
import { Classe, Course } from '@/lib/data';



export const AdminTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'upload'>('upload');
  const [classes, setClasses] = useState<Classe[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getcourses');
        const data = await response.json();
        setClasses(data.classes);
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
};

