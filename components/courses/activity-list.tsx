"use client";

import type { Activity } from "@/lib/data";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaRegFilePdf, FaFileInvoice, FaRegImage, FaPython, FaVideo } from 'react-icons/fa6';
import { GiSoundOn } from "react-icons/gi";
// import { toast } from 'react-hot-toast';
import { toast, Id } from 'react-toastify';
import { downloadFileWithProgress } from '@/components/courses/donwload-track';
import { RATE_LIMIT } from '@/lib/rateLimit';
import { Tooltip } from "@nextui-org/react";
import { CircleChevronDown } from 'lucide-react';
import { getFileType, getFileIcon } from "@/components/utils/fileUtils"; // Assurez-vous d'avoir ces fonctions disponibles
import { Divider } from "@mui/material"; 

interface ActivityListProps {
  themeChoice: number;
  activities: Activity[];
  onSelectActivity: (fileUrl: string, type: string, activity: Activity) => void;
  onToggleSideBySide: (show: boolean) => void;
  handleFileSelection: (fileUrl: string, fileType: string, activity: Activity) => void;
  userName: string;                                // Reçu du parent
  setUserName: React.Dispatch<React.SetStateAction<string>>; // Reçu du parent
  onUniqueIdReceived: (uniqueId: string) => void;
}

export function ActivityList({
  themeChoice,
  activities,
  onSelectActivity,
  onToggleSideBySide,
  handleFileSelection,
  userName,
  setUserName,
  onUniqueIdReceived
}: ActivityListProps) {

  const [toastId, setToastId] = useState<Id | null>(null);
  const [errorToastId, setErrorToastId] = useState<Id | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

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

  const handleActivityClick = async (fileUrl: string, activity: Activity) => {
    // Si on est en mode accordéon (themeChoice = 2), on le ferme lors du clic
    if (themeChoice === 2) {
      setIsAccordionOpen(false);
    }
    
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
    toast.dismiss();
    toast.clearWaitingQueue();
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


      if (existingNotebookInCookie && existingUserName === userName && newNotebookFileName === existingNotebookInCookie) {
        // Use the existing notebook fileName
        const existingDirCookie = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('notebookDir='));
        const existingDir = existingDirCookie?.split('=')[1];

        

        const tokenResponse = await fetch('/api/jupyter-list');
        const tokenData = await tokenResponse.json();
        if (!tokenData.error) {
          const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${existingDir}/${newNotebookFileName}?token=${tokenData.token}`;
          onSelectActivity(jupyterUrl, 'ipynb', activity);
          // Save file path info in cookies
          document.cookie = `notebookFileName=${newNotebookFileName}; path=/; max-age=2592000`; // 30 days = 30 * 24 * 60 * 60 = 2592000 seconds
          document.cookie = `notebookDir=${existingDir};  path=/; max-age=2592000`
          document.cookie = `notebookUserName=${userName};  path=/; max-age=2592000`;
          document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=2592000`;
          
          
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

      onUniqueIdReceived(data.uniqueId);

      const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${data.dirPath}/${data.fileName}?token=${tokenData.token}`;
      onSelectActivity(jupyterUrl, 'ipynb', activity);
      

      // Save file path info in cookies
      document.cookie = `notebookFileName=${data.fileName}; path=/; max-age=2592000`;
      document.cookie = `notebookDir=${data.dirPath};  path=/; max-age=2592000`;
      document.cookie = `notebookUserName=${userName};  path=/; max-age=2592000`;
      document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=2592000`;
      document.cookie = `notebookUniqueId=${data.uniqueId};  path=/; max-age=2592000`;
      
      
    } else if (fileExtension && ['png','jpg','jpeg','gif','svg','heic','webmp'].includes(fileExtension)) {
      const apiUrl = `/api/files${fileUrl}`;
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, 'image', activity);
      onSelectActivity(objectUrl, 'image', activity);
    } else if (fileExtension && ['mp4','avi','mov'].includes(fileExtension)) {
      onSelectActivity(fileUrl, 'video', activity);
      handleFileSelection(fileUrl, 'video', activity);
    } else if (fileExtension && ['tsx'].includes(fileExtension)) {
      onSelectActivity(fileUrl, 'typescript', activity);
    } else if (fileExtension && ['pdf'].includes(fileExtension)) {
      const apiUrl = `/api/files${fileUrl}`;
      const objectUrl = await downloadFileWithProgress(apiUrl); // Only executed after button click
      onSelectActivity(objectUrl, 'pdfType', activity);
      handleFileSelection(objectUrl, 'pdfType', activity);
    } else if (fileExtension && ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(fileExtension)) {
      const apiUrl = `/api/files${fileUrl}`;
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, 'audio', activity);
      onSelectActivity(objectUrl, 'audio', activity);
    } else {
      const apiUrl = `/api/files${fileUrl}`;
      try {
        const objectUrl = await downloadFileWithProgress(apiUrl); // Only executed after button click
        onSelectActivity(objectUrl, 'other', activity);
        handleFileSelection(objectUrl, 'other', activity);
      } catch (error) {
        toast.error('Erreur lors du téléchargement');
      }
    }
  };
  


  const getFileType = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webmp'].includes(extension || '')) return 'Images';
    if (['pdf'].includes(extension || '')) return 'Documents PDF';
    if (['ipynb'].includes(extension || '')) return 'Notebooks Python';
    if (['mp4', 'avi', 'mov'].includes(extension || '')) return 'Vidéos';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension || '')) return 'Audio';
    return 'Autres fichiers';
  };

  // Groupe les activités par type pour themeChoice = 1
  const groupedActivities = React.useMemo(() => {
    const groups: Record<string, Activity[]> = {};
    
    activities.forEach(activity => {
      const fileType = getFileType(activity.name);
      if (!groups[fileType]) {
        groups[fileType] = [];
      }
      groups[fileType].push(activity);
    });
    
    return groups;
  }, [activities]);

  // Affichage horizontal (themeChoice = 0, par défaut)
  if (themeChoice === 0) {
    return (
      <div className="flex flex-wrap flex-row gap-4">
        {activities.map((activity) => (
          <Tooltip 
            key={activity.id}
            content={activity.title}
            closeDelay={550}
            className="z-50 px-3 py-2 text-sm font-medium text-white bg-zinc-800/95 
              rounded-lg shadow-lg backdrop-blur-sm border border-zinc-700/50 
              transition-opacity duration-300"
          >
            <Button
              variant="outline"
              className="inline-flex items-center justify-start w-auto min-w-[100px] max-w-[300px] truncate"
              onClick={() => handleActivityClick(activity.fileUrl, activity)}
            >
              <div className="flex items-center justify-center w-8 h-8 mr-2">{getFileIcon(activity.name)}</div>
              <span className="truncate">{activity.title}</span>
            </Button>
          </Tooltip>
        ))}
      </div>
    );
  }
  
  // Affichage accordéon (themeChoice = 2)
  if (themeChoice === 2) {
    return (
        <div className={`w-full transition-all duration-300 ${isAccordionOpen ? 'mb-6' : 'mb-0'}`}>
          <div 
            className="flex items-center justify-between bg-gray-200 p-3 rounded-t-2xl cursor-pointer select-none"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <h3 className="text-lg font-medium">Ressources du cours</h3>
          <div className={`transform transition-transform ${isAccordionOpen ? 'rotate-180' : 'rotate-0'}`}>
          <CircleChevronDown size={28} strokeWidth={1.5} absoluteStrokeWidth />
          </div>
          </div>
          
          <div 
            className={`transition-all duration-300 overflow-hidden bg-white border-x border-b border-gray-200 rounded-b-md
          ${isAccordionOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
          {Object.entries(groupedActivities).map(([groupName, groupActivities]) => (
            <div key={groupName} className="mb-4">
              <div className="space-y-2">
            {groupActivities.map(activity => (
              <Tooltip 
                key={activity.id}
                content={activity.title}
                closeDelay={550}
                className="z-50 px-3 py-2 text-sm font-medium text-white bg-zinc-800/95 
              rounded-lg shadow-lg backdrop-blur-sm border border-zinc-700/50 
              transition-opacity duration-300"
            >
                        <Button
                        variant="outline"
                        className="w-auto justify-start text-left h-auto mx-1"
                        onClick={() => handleActivityClick(activity.fileUrl, activity)}
                        >
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-2">{getFileIcon(activity.name)}</div>
                          <span className="truncate">{activity.title}</span>
                        </div>
                        </Button>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Affichage vertical groupé par type (themeChoice = 1)
  return (
    <div className="w-full md:w-64 lg:w-72 flex-shrink-0 border-r border-gray-200 pr-4">
      {Object.entries(groupedActivities).map(([groupName, groupActivities]) => (
        <div key={groupName} className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-2">{groupName}</h3>
          <div className="space-y-2">
            {groupActivities.map(activity => (
              <Tooltip 
                key={activity.id}
                content={activity.title}
                closeDelay={550}
                className="z-50 px-3 py-2 text-sm font-medium text-white bg-zinc-800/95 
                  rounded-lg shadow-lg backdrop-blur-sm border border-zinc-700/50 
                  transition-opacity duration-300"
              >
              <Button
                variant="outline"
                className="w-full justify-start text-left pl-2 py-1.5 h-auto"
                onClick={() => handleActivityClick(activity.fileUrl, activity)}
              >
                <div className="flex items-center w-full">
                  <div className="flex-shrink-0 mr-2">{getFileIcon(activity.name)}</div>
                  <span className="truncate block w-[calc(100%-32px)]" title={activity.title}>
                    {activity.title}
                  </span>
                </div>
              </Button>
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}