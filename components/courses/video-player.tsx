import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

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
    <Box sx={{ mt:6}}>
      <Grid container 
        justifyContent="center"
        alignItems="center"
      >
        <Grid size={{ xs:12, md:6, lg:6 }}
          sx={{ 
            justifyContent: 'center', 
            display: 'flex', 
            alignContent: 'center', 
            justifyItems: 'center' 
          }}
        >
          <Button 
            onClick={() => setShowVideo(true)}
            variant="contained"
            color="success"
          >
            Regarder la vidéo
          </Button>
        </Grid>
        <Grid size={{ xs:12, md:6, lg:6 }}
          sx={{ 
            justifyContent: 'center', 
            display: 'flex', 
            alignContent: 'center', 
            justifyItems: 'center' 
          }}
        >
          <Button 
            onClick={showDownloadPrompt}
            variant="contained"
            color="primary"
          >
            Télécharger la vidéo ?
          </Button>
        </Grid>
      </Grid>
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Grid >
          <Card sx={{ width: 320, boxShadow: 2, borderRadius: 2, mx: 'auto' }}>
            <CardMedia
              component="video"
              src={`/api/files${fileUrl}`}
              controls
              sx={{ height: 180, backgroundColor: '#000', objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 1 }}>
              <Typography variant="subtitle2" noWrap title={fileName} align="center">
                {fileName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {showVideo && (
        <Box position="fixed" top={0} left={0} width="100vw" height="100vh" zIndex={1300} display="flex" alignItems="center" justifyContent="center" bgcolor="rgba(0,0,0,0.5)">
          <Card sx={{ maxWidth: 800, width: '90vw', p: 2 }}>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={() => setShowVideo(false)} color="secondary">Fermer</Button>
            </Box>
            <CardMedia
              component="video"
              src={`/api/files${fileUrl}`}
              controls
              autoPlay
              sx={{ width: '100%', height: 400, backgroundColor: '#000' }}
            />
          </Card>
        </Box>
      )}
    </Box>
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