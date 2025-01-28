"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from 'dompurify';
import ActivityHeader from "@/components/courses/activity-header";
import { ActivityList } from "@/components/courses/activity-list";
import { Course } from "@/lib/data";
import NotFound from "@/app/not-found";
import LoadingPage from "@/app/loading";
import Split from 'react-split';
import ImageZoom from "@/components/courses/image-zoom";
import { VideoActions } from "@/components/courses/video-player";
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react'; // Add this import
import { toast, Id } from 'react-toastify'; // Add this import
import OtpInput from 'react-otp-input';
import Divider from '@mui/material/Divider';

// Add helper function to detect mobile
const isMobileDevice = () => {
  return (typeof window !== 'undefined' && 
    (window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  );
};

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [selectedFileLeft, setSelectedFileLeft] = useState<string | null>(null);
  const [selectedFileRight, setSelectedFileRight] = useState<string | null>(null);
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false);
  const [lastClickedType, setLastClickedType] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [toastId, setToastId] = useState<Id | null>(null); // Add this state
  const ipynbDivRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeRightRef = useRef<HTMLIFrameElement>(null); // Add new ref
  const [splitSizes, setSplitSizes] = useState([50, 50]);
  const [leftFileType, setLeftFileType] = useState<string | null>(null);
  const [iframeKeyLeft, setIframeKeyLeft] = useState(0);
  const router = useRouter();
  const [currentUniqueId, setCurrentUniqueId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUniqueIdReceived = (id: string) => {
    setCurrentUniqueId(id);
  };

  const handleOTPChange = (value: string) => {
    setCurrentUniqueId(value.toUpperCase());
  };

  useEffect(() => {
    if (!userName) {
      // Lire une éventuelle valeur dans le cookie si userName est vide pour initialiser
      const userNameCookie = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('notebookUserName='));
      
      if (userNameCookie) {
        const userNameValue = userNameCookie.split('=')[1];
        setUserName(userNameValue);
      }
    }
  }, [userName, setUserName]);

  const handleFileSelection = (fileUrl: string, fileType: string) => {
    if (fileType === 'other' && isMobileDevice()) {
      // Open PDF in new tab on mobile
      window.open(fileUrl, '_blank');
      return;
    }

    // Set iframe src directly
    if (iframeRightRef.current && fileType === 'ipynb') {
      iframeRightRef.current.src = fileUrl;
    }

    if (fileType !== 'image' && fileType !== 'video' && selectedFileLeft === fileUrl && !isMobileDevice()) {
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
          router.push('/not-found');
            return;
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
    // Clear all cookies
    document.cookie = 'notebookUserName=; Max-Age=0; path=/';
    document.cookie = 'notebookFileName=; Max-Age=0; path=/';
    document.cookie = 'notebookDir=; Max-Age=0; path=/';
    document.cookie = 'notebookURL=; Max-Age=0; path=/';
    document.cookie = 'notebookUniqueId=; Max-Age=0; path=/';
    
    // Reset all states
    setUserName('');
    setCurrentUniqueId('');
    setSelectedFileLeft(null);
    setSelectedFileRight(null);
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    if (iframeRightRef.current) {
      iframeRightRef.current.src = '';
    }
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

  useEffect(() => {
    const uniqueIdCookie = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('notebookUniqueId='));
    console.log('Unique ID cookie:', uniqueIdCookie);
    console.log('Unique ID:', currentUniqueId);
    if (uniqueIdCookie) {
      const uniqueIdValue = uniqueIdCookie.split('=')[1];
      setCurrentUniqueId(uniqueIdValue);
    }
  }, []);

  const handleVerifyNotebook = async () => {
    if (!currentUniqueId || currentUniqueId.length !== 6) return;
    console.log('Verifying notebook with ID:', currentUniqueId);
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/verifyNotebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId: currentUniqueId }),
      });
      
      const data = await response.json();
      console.log('Verification response:', data);
      
      if (data.success) {
        // Set userName and save in cookies
        setUserName(data.userName);
        document.cookie = `notebookUserName=${data.userName}; path=/; max-age=2592000`;

        // Get token before clearing iframe
        const tokenResponse = await fetch('/api/jupyter-list');
        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
          console.error('Token error:', tokenData.error);
          return;
        }

        const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${data.dirPath}/${data.orginalFileName}?token=${tokenData.token}`;
        console.log('Opening notebook:', jupyterUrl);
        
        // Only update iframeRightRef
        if (iframeRightRef.current) {
          iframeRightRef.current.src = jupyterUrl;
        }
        handleSelectActivity(jupyterUrl, 'ipynb');
        toast.dismiss();
        toast.clearWaitingQueue();
        toast.success(
          'Notebook chargé avec succès', 
          {
            className: "toast-centered",
            style: {
              width: '380px',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
              alignItems: 'center',
            },
            autoClose: 3000,
          }
        );
        // Save file path info in cookies
        document.cookie = `notebookFileName=${data.orginalFileName}; path=/; max-age=2592000`;
        document.cookie = `notebookDir=${data.dirPath}; path=/; max-age=2592000`;
        document.cookie = `notebookURL=${jupyterUrl}; path=/; max-age=2592000`;
        document.cookie = `notebookUniqueId=${currentUniqueId}; path=/; max-age=2592000`;
      } else {
          toast.dismiss();
          toast.clearWaitingQueue();
          toast.error(
            'Code introuvable ...', 
            {
              className: "toast-centered",
              style: {
                width: '230px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                alignItems: 'center',
              },
              autoClose: false,
            }
          );
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error(
        `Erreur lors de la vérification: ${error}`, 
        {
          className: "toast-centered",
          style: {
            width: '400px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
            alignItems: 'center',
          },
          autoClose: false,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedFileLeft && iframeRightRef.current && leftFileType === 'ipynb') {
      iframeRightRef.current.src = selectedFileLeft;
    }
  }, [selectedFileLeft, leftFileType]);

  if (!course) {
    return <LoadingPage />;
  }

  const hasIpynb = course.activities.some((activity) => activity.name.endsWith('.ipynb'));

  // Add this component inside CoursePage
  const MobileOpenButton = ({ url }: { url: string }) => (
    <div className="flex h-full items-start justify-center p-4">
      <Button 
        onClick={() => window.open(url, '_blank')}
        className="flex items-center gap-2 text-lg"
      >
        <ExternalLink size={24} />
        Ouvrir dans un nouvel onglet
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col w-full md:max-w-[750px] lg:max-w-[960px] xl:max-w-[1200px] mx-auto px-4 md:px-0">
      <ActivityHeader title={course.title} description={course.description} />

      <div className="flex flex-col w-full md:grid-cols-4">
      <ActivityList
          activities={course.activities}
          onSelectActivity={handleSelectActivity}
          onToggleSideBySide={handleToggleSideBySide}
          handleFileSelection={handleFileSelection}
          userName={userName}
          setUserName={setUserName}
          onUniqueIdReceived={handleUniqueIdReceived}
          />

      {/* <div className="w-full h-[3px] my-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent" /> */}
      <Divider variant="middle" sx={{ my: 2, borderBottomWidth: '2px' }}></Divider>
      {hasIpynb && (
          <div className="flex flex-col w-full md:flex-row justify-between items-center p-4">
            <div className="flex flex-col gap-4">
            <Input
                className="inputNameActivityList min-w-[200px]"
                type="text"
                placeholder="Entrez votre prénom"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => {
                  if (toastId) {
                    toast.dismiss();
                    toast.clearWaitingQueue();
                    setToastId(null);
                  }
                }}
              />
            <div className="flex flex-row items-center justify-around gap-4">
            <div className="">
              Double vue
            </div>
              <label className="checkboxSwitch">
                <input
                  type="checkbox"
                  checked={showSideBySide}
                  onChange={(e) => setShowSideBySide(e.target.checked)}
                />
                <span className="checkboxSlider checkboxSliderEleve"></span>
              </label>
            </div>
            </div>
            <div className="flex flex-col gap-4 md:mt-0 mt-4">
              <OtpInput
                value={currentUniqueId}
                onChange={handleOTPChange}
                numInputs={6}
                renderSeparator={""}
                renderInput={(props) => <input {...props} />}
                containerStyle="flex gap-2"
                inputStyle={{
                  width: '2rem',
                  height: '2.5rem',
                  margin: '0 2px',
                  fontSize: '1rem',
                  borderRadius: '4px',
                  border: '2px solid rgb(42, 101, 196)',
                  textAlign: 'center'
                }}
              />
            <Button 
              onClick={handleVerifyNotebook}
              disabled={isLoading || !currentUniqueId || currentUniqueId.length !== 6}
              className=""
            >
              {isLoading ? 'Chargement...' : 'Charger un notebook'}
            </Button>
            </div>
            

            <Button onClick={handleClearCookies} className="bg-red-300 text-white w-[auto] hover:bg-red-700 md:mt-0 mt-4">
              Effacer vos données
            </Button>
          </div>
        )}

      </div>

      <div className="mt-4 md:mt-8 flex justify-center h-[900px] w-full overflow-y-auto">
        {showSideBySide ? (
          <Split
            className="flex w-full split-container flex-col md:flex-row"
            sizes={[50, 50]}
            minSize={1}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={1}
            onDrag={handleDrag}
            dragInterval={2}
            direction={window.innerWidth < 768 ? 'vertical' : 'horizontal'}
          >
            <div className="w-full h-full md:h-auto">
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
                <div className="w-full h-full relative">
                  <iframe 
                    key={iframeKeyLeft} 
                    src={selectedFileLeft} 
                    className="w-full h-full absolute inset-0"
                    style={{border: 'none'}}
                  />
                </div>
              )}
            </div>
            <div className="w-full h-full md:h-auto">
              {selectedFileRight && (
                <div className="w-full h-full relative">
                  <iframe 
                    ref={iframeRightRef} 
                    src={selectedFileRight} 
                    className="w-full h-full absolute inset-0"
                    style={{border: 'none'}}
                  />
                </div>
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
                <>
                  {isMobileDevice() && leftFileType === 'other' ? (
                    <MobileOpenButton url={selectedFileLeft} />
                  ) : (
                    <iframe
                      key={iframeKeyLeft}
                      ref={iframeRef}
                      src={selectedFileLeft}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </>
              )}
            </div>
            <div
              ref={ipynbDivRef}
              className="ipynbDiv"
              style={{ width: lastClickedType === 'ipynb' && selectedFileRight ? '100%' : '0%', height: '100%', display: selectedFileRight && lastClickedType === 'ipynb' ? 'block' : 'none' }}>
              {selectedFileRight && (
                <iframe  ref={iframeRightRef} src={selectedFileRight} style={{ width: '100%', height: '100%' }}></iframe>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}