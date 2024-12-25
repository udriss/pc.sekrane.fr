"use client";

import type { Activity } from "@/lib/data";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const [embeddedUrl, setEmbeddedUrl] = useState<string | null>(null);
  const [jupyterToken, setJupyterToken] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/jupyter-list')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching Jupyter token:', data.error);
        } else {
          setJupyterToken(data.token);
        }
      })
      .catch(error => console.error('Error fetching Jupyter token:', error));
  }, []);

  const handleActivityClick = async (fileUrl: string) => {
    if (fileUrl.endsWith('.ipynb')) {
      // Extract courseId from the fileUrl
      const courseId = fileUrl.split('/')[1];

      // Generate a unique file for the student
      const response = await fetch('/api/generate-notebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (response.ok) {
        // Create the URL for the Jupyter server with the new directory and file
        const jupyterUrl = `https://jupyter.sekrane.fr/notebooks/${data.dirPath}/${data.fileName}?token=${jupyterToken}`;
        console.log("Jupyter URL:", jupyterUrl);

        // Set the embedded URL to display the notebook in an iframe
        setEmbeddedUrl(jupyterUrl);
      } else {
        console.error('Error generating notebook:', data.error);
      }
    } else {
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div>
        <h1>Jupyter Token</h1>
        <pre>{jupyterToken}</pre>
        <br />
      </div>
      <div className="flex flex-wrap max-w-[600px] gap-4">
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
      {embeddedUrl && (
        <div className="mt-8 w-full" style={{ width: '700px', height: '700px', overflowY: 'scroll' }}>
          <iframe
            src={embeddedUrl}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0"
          ></iframe>
        </div>
      )}
    </div>
  );
}