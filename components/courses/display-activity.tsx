"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ActivityHeader from "@/components/courses/activity-header";
import { ActivityList } from "@/components/courses/activity-list";
import { Course } from "@/lib/data";
import { notFound } from "next/navigation";
import LoadingPage from "@/app/loading";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [selectedFileLeft, setSelectedFileLeft] = useState<string | null>(null);
  const [selectedFileRight, setSelectedFileRight] = useState<string | null>(null);
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false);
  const [lastClickedType, setLastClickedType] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const ipynbDivRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    async function unwrapParams() {
      const unwrappedParams = await params;
      setCourseId(unwrappedParams.courseId);
    }
    unwrapParams();
  }, [params]);

  useEffect(() => {
    async function fetchCourse() {
      if (courseId) {
        const res = await fetch(`/api/courses/${courseId}`);
        if (res.status === 404) {
          notFound();
        } else {
          const data = await res.json();
          if (data && data.course) {
            setCourse(data.course);
          } else {
            console.error("Invalid course data:", data);
          }
        }
      }
    }
    fetchCourse();
  }, [courseId]);

  const handleSelectActivity = (fileUrl: string, type: string) => {
    if (type === 'ipynb') {
      setSelectedFileRight(fileUrl);
    } else {
      setSelectedFileLeft(fileUrl);
    }
    setLastClickedType(type);
  };

  const handleToggleSideBySide = (show: boolean) => {
    setShowSideBySide(show);
  };

  const handleClearCookies = () => {
    document.cookie = 'notebookFileName=; path=/; max-age=0';
    document.cookie = 'notebookDir=; path=/; max-age=0';
    document.cookie = 'notebookUserName=; path=/; max-age=0';
    document.cookie = 'notebookURL=; path=/; max-age=0';
    setUserName('');
    // Vider manuellement le contenu de l'iframe
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    console.log('Cookies et iframe iPyNB effacés');
  };

  if (!course) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[1400px] mx-auto">
      <ActivityHeader title={course.title} description={course.description} />

      <div className="grid grid-cols-4">
        <div className="flex flex-row p-4 col-span-3">
          <ActivityList
            activities={course.activities}
            onSelectActivity={handleSelectActivity}
            onToggleSideBySide={handleToggleSideBySide}
            userName={userName}
            setUserName={setUserName}
          />
        </div>

        <div className="flex flex-col col-span-1 justify-center items-center">
          <div className="ml-2">
            Double vue
          </div>
          <div>
            <label className="checkboxSwitch">
              <input
                type="checkbox"
                checked={showSideBySide}
                onChange={(e) => setShowSideBySide(e.target.checked)}
              />
              <span className="checkboxSlider checkboxSliderEleve"></span>
            </label>
          </div>
          <Button onClick={handleClearCookies} className="mt-4 bg-red-500 text-white w-[auto] hover:bg-red-700">
            Effacer les données
          </Button>
        </div>
      </div>
      <div className="mt-8 flex justify-center" style={{ height: '700px', width: '100%', overflowY: 'scroll' }}>
        <div style={{ width: showSideBySide ? '50%' : !showSideBySide && lastClickedType !== 'ipynb' && selectedFileLeft ? '100%' : '0%', height: '100%', display: selectedFileLeft && (showSideBySide || lastClickedType !== 'ipynb') ? 'block' : 'none' }}>
          {selectedFileLeft && (
            <iframe src={selectedFileLeft} style={{ width: '100%', height: '100%' }}></iframe>
          )}
        </div>
        <div
          ref={ipynbDivRef}
          className="ipynbDiv"
          style={{ width: showSideBySide ? '50%' : !showSideBySide && lastClickedType === 'ipynb' && selectedFileRight ? '100%' : '0%', height: '100%', display: selectedFileRight && (showSideBySide || lastClickedType === 'ipynb') ? 'block' : 'none' }}>
          {selectedFileRight && (
            <iframe ref={iframeRef}  src={selectedFileRight} style={{ width: '100%', height: '100%' }}></iframe>
          )}
        </div>
      </div>
    </div>
  );
}

