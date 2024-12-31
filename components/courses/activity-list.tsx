"use client";

import type { Activity } from "@/lib/data";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  onSelectActivity: (fileUrl: string, type: string) => void;
  onToggleSideBySide: (show: boolean) => void;
  userName: string;                                // Reçu du parent
  setUserName: React.Dispatch<React.SetStateAction<string>>; // Reçu du parent
}

export function ActivityList({
  activities,
  onSelectActivity,
  onToggleSideBySide,
  userName,
  setUserName,
}: ActivityListProps) {

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

  const handleActivityClick = async (fileUrl: string) => {
    if (fileUrl.endsWith('.ipynb')) {
      if (!userName) {
        alert('Veuillez entrer votre nom.');
        return;
      }

      // Check if we already have a notebook cookie
      const existingCookie = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('notebookFileName='));
      const existingUserNameCookie = document.cookie
        .split(';')
        .find(cookie => cookie.trim().startsWith('notebookUserName='));
      const existingUserName = existingUserNameCookie?.split('=')[1];

      if (existingCookie && existingUserName === userName) {
        // Use the existing notebook fileName
        const existingFileName = existingCookie.split('=')[1];
        const existingDirCookie = document.cookie
          .split(';')
          .find(cookie => cookie.trim().startsWith('notebookDir='));
        const existingDir = existingDirCookie?.split('=')[1];

        if (existingDir && existingFileName) {
          const tokenResponse = await fetch('/api/jupyter-list');
          const tokenData = await tokenResponse.json();
          if (!tokenData.error) {
            const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${existingDir}/${existingFileName}?token=${tokenData.token}`;
            onSelectActivity(jupyterUrl, 'ipynb');
            // Save file path info in cookies
            document.cookie = `notebookFileName=${existingFileName}; path=/; max-age=3600`;
            document.cookie = `notebookDir=${existingDir};  path=/; max-age=3600`;
            document.cookie = `notebookUserName=${userName};  path=/; max-age=3600`;
            document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=3600`;
            console.log('Generated cookie ### 1:', document.cookie);
            return;
          }
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
        body: JSON.stringify({ courseId, userName }),
      });

      const data = await response.json();
      if (!response.ok) return;

      const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${data.dirPath}/${data.fileName}?token=${tokenData.token}`;
      onSelectActivity(jupyterUrl, 'ipynb');
      console.log('Generated notebook:', jupyterUrl);

      // Save file path info in cookies
      document.cookie = `notebookFileName=${data.fileName}; path=/; max-age=3600`;
      document.cookie = `notebookDir=${data.dirPath};  path=/; max-age=3600`;
      document.cookie = `notebookUserName=${userName};  path=/; max-age=3600`;
      document.cookie = `notebookURL=${jupyterUrl};  path=/; max-age=3600`;
      console.log('Generated cookie 2:', document.cookie);
    } else {
      const apiUrl = `/api/files/${fileUrl}`;
      onSelectActivity(apiUrl,  'other');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Entrez votre nom"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap flex-row gap-4">
        {activities.map((activity) => (
          <Button
            key={activity.id}
            variant="outline"
            className="inline-flex items-center justify-start"
            onClick={() => handleActivityClick(activity.fileUrl)}
          >
            <FileText className="mr-2 h-4 w-4" />
            {activity.title}
          </Button>
        ))}
      </div>
    </div>
  );
}