import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// ...existing code...



interface VideoPlayerProps {
  fileUrl: string;
  fileName?: string;
}

export function VideoActions({ fileUrl, fileName }: VideoPlayerProps) {
  const [showVideo, setShowVideo] = useState(false);

  const handleDownload = async () => {
    const toastId = toast.loading("Préparation du téléchargement...");
    try {
      const response = await fetch(`/api/files${fileUrl}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName ?? fileUrl.split('/').pop() ?? 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.update(toastId, {
        render: "Téléchargement réussi !",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Le téléchargement a échoué",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    }
  };

  const showDownloadPrompt = () => {
    toast.info(
      <div>
        <p>Lancer le téléchargement de : </p> 
        <p> {fileName} </p>
        <div className="mt-2 flex justify-around">
          <button
            onClick={() => {
              handleDownload();
              toast.dismiss();
              toast.clearWaitingQueue();
            }}
            className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded mr-2"
          >
            Oui
          </button>
          <button
            onClick={() => {
              toast.dismiss(); 
              toast.clearWaitingQueue();
            }}
            className="bg-gray-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Non
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    );
  };

  return (
    <div className="flex space-x-4 p-4">
      <button 
        onClick={showDownloadPrompt}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Télécharger la vidéo ?
      </button>
      
      
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg w-full max-w-4xl">
            <div className="flex justify-end mb-2">
              <button 
                onClick={() => setShowVideo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Fermer
              </button>
            </div>
            <VideoPlayer fileUrl={fileUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ fileUrl }) => {
  return (
    <video width="100%" height="auto" controls>
      <source src={fileUrl} />
      Your browser does not support HTML5 video.
    </video>
  );
};

// Bouton permettant de lancer la vidéo avec showVideo
// <button 
//  onClick={() => setShowVideo(true)}
//  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
//>
//  Regarder la vidéo
//</button>