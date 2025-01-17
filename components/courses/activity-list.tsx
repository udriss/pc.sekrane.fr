"use client";

import type { Activity } from "@/lib/data";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaRegFilePdf, FaFileInvoice, FaRegImage, FaPython, FaVideo } from 'react-icons/fa6';
// import { toast } from 'react-hot-toast';
import { toast, Id } from 'react-toastify';
import { downloadFileWithProgress } from '@/components/courses/donwload-track';
import { RATE_LIMIT } from '@/lib/rateLimit';

interface ActivityListProps {
  activities: Activity[];
  onSelectActivity: (fileUrl: string, type: string) => void;
  onToggleSideBySide: (show: boolean) => void;
  handleFileSelection: (fileUrl: string, fileType: string) => void;
  userName: string;                                // Reçu du parent
  setUserName: React.Dispatch<React.SetStateAction<string>>; // Reçu du parent
}

export function ActivityList({
  activities,
  onSelectActivity,
  onToggleSideBySide,
  handleFileSelection,
  userName,
  setUserName,
}: ActivityListProps) {

  const [toastId, setToastId] = useState<Id | null>(null);
  const [errorToastId, setErrorToastId] = useState<Id | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const formatDuration = (ms: number) => {
    return Math.ceil(ms / 1000);
  };

  const handleActivityClick = async (fileUrl: string) => {
    // Clear existing interval if any
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const deviceId = localStorage.getItem('deviceFingerprint');
    const key = `rateLimit_${deviceId}_${fileUrl}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();
      const timeElapsed = now - data.timestamp;
      const remainingTime = Math.max(0, RATE_LIMIT.windowMs - timeElapsed);

      if (!RATE_LIMIT.check(fileUrl)) {
        // Dismiss existing error toast if any
        if (errorToastId) {
          toast.dismiss(errorToastId);
        }
        toast.dismiss();
        toast.clearWaitingQueue();
        
        const newToastId = toast.error(
          `Trop de tentatives. Patientez ${formatDuration(remainingTime)} secondes !`, 
          {
            style: {
              width: '400px',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
            },
            autoClose: false,
          }
        );

        setErrorToastId(newToastId);
        startTimeRef.current = Date.now();

        const updateMessage = () => {
          const elapsed = Date.now() - startTimeRef.current!;
          const remaining = Math.max(0, remainingTime - elapsed);
          
          if (remaining > 0) {
            toast.update(newToastId, {
              render: `Trop de tentatives. Patientez ${formatDuration(remaining)} secondes.`
            });
            animationFrameRef.current = requestAnimationFrame(updateMessage);
          } else {
            setErrorToastId(null);
            startTimeRef.current = null;
            toast.dismiss();
            toast.clearWaitingQueue();
          }
        };

        animationFrameRef.current = requestAnimationFrame(updateMessage);
        return;
      }
    }

    const fileExtension = fileUrl.split('.').pop();
    if (fileUrl.endsWith('.ipynb')) {
      if (!userName) {
        const id = toast.error('Entrez un nom pour utiliser ce notebook !', {
          autoClose: false,
          closeOnClick: true,
          style: {
            width: '400px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
          }
        });
        setToastId(id);
        return;
      }

      // Check if we already have a notebook cookie
      const existingNotebookInCookie = document.cookie
        .split(';')
        .find(cookie => cookie
          .trim()
          .startsWith('notebookFileName='))
          ?.split('=')[1];;
      const existingUserNameCookie = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('notebookUserName='));
      const existingUserName = existingUserNameCookie?.split('=')[1];
      const newNotebookFileName = fileUrl.split('/').pop(); // Get filename from URL

      //console.log('existingNotebookInCookie:', existingNotebookInCookie);
      //console.log('newNotebookFileName:', newNotebookFileName);
      //console.log('existingUserName:', existingUserName);
      //console.log('userName:', userName);
      //console.log('TEST', newNotebookFileName === existingNotebookInCookie);

      if (existingNotebookInCookie && existingUserName === userName && newNotebookFileName === existingNotebookInCookie) {
        // Use the existing notebook fileName
        const existingDirCookie = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('notebookDir='));
        const existingDir = existingDirCookie?.split('=')[1];

        //console.log('Existing notebook:', existingDir);

        const tokenResponse = await fetch('/api/jupyter-list');
        const tokenData = await tokenResponse.json();
        if (!tokenData.error) {
          const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${existingDir}/${newNotebookFileName}?token=${tokenData.token}`;
          onSelectActivity(jupyterUrl, 'ipynb');
          // Save file path info in cookies
          document.cookie = `notebookFileName=${newNotebookFileName}; path=/; max-age=2592000`; // 30 days = 30 * 24 * 60 * 60 = 2592000 seconds
          document.cookie = `notebookDir=${existingDir};  path=/; max-age=2592000`
          document.cookie = `notebookUserName=${userName};  path=/; max-age=2592000`;
          document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=2592000`;
          //console.log('Generated cookie ### Cashed:', document.cookie);
          return;
        }
      }

      // Otherwise, generate a new notebook
      const tokenResponse = await fetch('/api/jupyter-list');
      const tokenData = await tokenResponse.json();
      if (tokenData.error) return;

      const courseId = fileUrl.split('/')[1];
      const response = await fetch('/api/generate-notebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, userName, sendFileUrl : fileUrl }),
      });

      const data = await response.json();
      if (!response.ok) return;

      const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${data.dirPath}/${data.fileName}?token=${tokenData.token}`;
      onSelectActivity(jupyterUrl, 'ipynb');
      //console.log('Generated notebook:', jupyterUrl);

      // Save file path info in cookies
      document.cookie = `notebookFileName=${data.fileName}; path=/; max-age=3600`;
      document.cookie = `notebookDir=${data.dirPath};  path=/; max-age=3600`;
      document.cookie = `notebookUserName=${userName};  path=/; max-age=3600`;
      document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=3600`;
      
      //console.log('Generated cookie 2:', document.cookie);
    } else if (fileExtension && ['png','jpg','jpeg','gif','svg','heic','webmp'].includes(fileExtension)) {
      const apiUrl = `/api/files${fileUrl}`;
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, 'image');
      onSelectActivity(objectUrl, 'image');
    } else if (fileExtension && ['mp4','avi','mov'].includes(fileExtension)) {
      onSelectActivity(fileUrl, 'video');
      handleFileSelection(fileUrl, 'video');
    } else if (fileExtension && ['tsx'].includes(fileExtension)) {
      onSelectActivity(fileUrl, 'typescript');
    } else {
      const apiUrl = `/api/files${fileUrl}`;
      try {
        const objectUrl = await downloadFileWithProgress(apiUrl); // Only executed after button click
        onSelectActivity(objectUrl, 'other');
        handleFileSelection(objectUrl, 'other');
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      }
    }
  };
  const hasIpynb = activities.some((activity) => activity.name.endsWith('.ipynb'));

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FaRegImage className="mr-2 h-6 w-6" />;
      case 'pdf':
        return <FaRegFilePdf className="mr-2 h-6 w-6" />;
      case 'ipynb':
        return <FaPython className="mr-2 h-6 w-6" style={{ color: 'rgb(236, 189, 24)' }} />;  
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FaVideo className="mr-2 h-6 w-6" style={{ color: 'rgba(2, 93, 211, 0.82)' }} />;
      default:
        return <FaFileInvoice className="mr-2 h-6 w-6" style={{ color: 'gray' }} />;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        
        {hasIpynb && (
          <div className="mb-4 w-full max-w-[200px]">
          <Input
            className="inputNameActivityList"
            type="text"
            placeholder="Entrez votre nom"
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
          </div>
        )}
        <div className="flex flex-wrap flex-row gap-4">
          {activities
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((activity) => (
            <Button
              key={activity.id}
              variant="outline"
              className="inline-flex items-center justify-start"
              onClick={() => handleActivityClick(activity.fileUrl)}
            >
              {getFileIcon(activity.name)}
              {activity.title}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}