"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import DOMPurify from 'dompurify';
import ActivityHeader from "@/components/courses/activity-header";
import { ActivityList } from "@/components/courses/activity-list";
import { Course } from "@/lib/data";
import { notFound } from "next/navigation";
import LoadingPage from "@/app/loading";
import Split from 'react-split';
import ImageZoom from "@/components/courses/image-zoom";
import { VideoActions } from "@/components/courses/video-player";
import FileViewer from '@/components/courses/file-viewer';


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
  const [splitSizes, setSplitSizes] = useState([50, 50]);
  const [leftFileType, setLeftFileType] = useState<string | null>(null);
  const [iframeKeyLeft, setIframeKeyLeft] = useState(0);

  const handleFileSelection = (fileUrl: string, fileType: string) => {
    if (fileType !== 'image' && fileType !== 'video' && selectedFileLeft === fileUrl) {
      setIframeKeyLeft(prev => prev + 1);
    }
    setSelectedFileLeft(fileUrl);
    setLeftFileType(fileType);
  };
  

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
      setLeftFileType(type);
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
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    console.log('Cookies et iframe iPyNB effacés');
  };

  const handleDrag = (sizes: number[]) => {
    const minSize = 20;
    const maxSize = 80;
    const newSizes = sizes.map(size => {
      if (size < minSize) return minSize;
      if (size > maxSize) return maxSize;
      return size;
    });
    setSplitSizes(newSizes);
  };
  const sanitizeContent = (content: string): string => {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'class', 'id']
    });
  };

  if (!course) {
    return <LoadingPage />;
  }

  const hasIpynb = course.activities.some((activity) => activity.name.endsWith('.ipynb'));

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
            handleFileSelection={handleFileSelection}
          />
        </div>

        {hasIpynb && (
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
        )}
      </div>

      <div className="mt-8 flex justify-center" style={{ height: '1400px', width: '100%', overflowY: 'scroll' }}>
        {showSideBySide ? (
          <Split
            className="flex w-full split-containe"
            sizes={[50, 50]}
            minSize={1}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={1}
            onDrag={handleDrag}
            dragInterval={2}
            gutter={(index: number, direction: "horizontal" | "vertical") => {
              const gutter = document.createElement('div');
              gutter.className = 'gutter-custom';
              return gutter;
            }}
          >
            <div style={{ height: '100%', display: selectedFileLeft ? 'block' : 'none' }}>
              {leftFileType === 'image' && selectedFileLeft && (
                <ImageZoom src={selectedFileLeft} />
              )}
              {leftFileType === 'video' && selectedFileLeft && (
                <VideoActions 
                fileUrl={selectedFileLeft} 
                fileName={selectedFileLeft.split('/').pop() || 'video'}
              />
              )}
              {leftFileType !== 'image' && leftFileType !== 'video' && selectedFileLeft && (
                <iframe key={iframeKeyLeft} src={selectedFileLeft} style={{ width: '100%', height: '100%' }}></iframe>
              )}
            </div>
            <div style={{ height: '100%', display: selectedFileRight ? 'block' : 'none' }}>
              {selectedFileRight && (
                <iframe ref={iframeRef} src={selectedFileRight} style={{ width: '100%', height: '100%' }}></iframe>
              )}
            </div>
          </Split>
        ) : (
          <>
            <div style={{ width: lastClickedType !== 'ipynb' && selectedFileLeft ? '100%' : '0%', height: '100%', display: selectedFileLeft && lastClickedType !== 'ipynb' ? 'block' : 'none' }}>
              {leftFileType === 'image' && selectedFileLeft && (
                <ImageZoom src={selectedFileLeft} />
              )}
                {leftFileType === 'video' && selectedFileLeft && (
                <VideoActions 
                  fileUrl={selectedFileLeft} 
                  fileName={selectedFileLeft.split('/').pop() || 'video'}
                />
                )}
              {leftFileType === 'typescript' && selectedFileLeft && (
                    <iframe 
                    srcDoc={sanitizeContent(selectedFileLeft)} 
                    style={{ width: '100%', height: '100%' }}
                    sandbox="allow-scripts"
                    ></iframe>
              )}
              {leftFileType !== 'image' && leftFileType !== 'video' && selectedFileLeft && (
                <iframe 
                key={iframeKeyLeft} 
                src={selectedFileLeft} 
                style={{ width: '100%', height: '100%' }}
                ></iframe>
              )}
            </div>
            <div
              ref={ipynbDivRef}
              className="ipynbDiv"
              style={{ width: lastClickedType === 'ipynb' && selectedFileRight ? '100%' : '0%', height: '100%', display: selectedFileRight && lastClickedType === 'ipynb' ? 'block' : 'none' }}>
              {selectedFileRight && (
                <iframe  ref={iframeRef} src={selectedFileRight} style={{ width: '100%', height: '100%' }}></iframe>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

