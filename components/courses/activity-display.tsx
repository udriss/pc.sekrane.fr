"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import DOMPurify from 'dompurify';
import ActivityHeader from "@/components/courses/activity-header";
import { ActivityList } from "@/components/courses/activity-list";
import { Course, Activity } from "@/lib/dataTemplate";
import LoadingPage from "@/app/loading";
import Split from 'react-split';
import ImageZoom from "@/components/courses/image-zoom";
import { VideoActions } from "@/components/courses/video-player";
import { useRouter, useSearchParams } from 'next/navigation';
import { toast, Id } from 'react-toastify';
import OtpInput from 'react-otp-input';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { RemoveCircleOutline } from '@mui/icons-material';
import { getFileIcon } from "@/components/utils/fileUtils"; 
import { downloadFileWithProgress } from '@/components/courses/donwload-track'; 


import "pdfjs-dist/web/pdf_viewer.css";

import { 
  OpenInNew as ExternalLink,
  Fullscreen as FullscreenIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { 
  FileDownload as Download 
} from '@mui/icons-material';
import { FileDropZone } from '@/components/courses/file-drop-zone';

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
  const [selectedFileLeftOrigin, setSelectedFileLeftOrigin] = useState<string | null>(null); // Ajout pour la comparaison fiable
  const [selectedFileRight, setSelectedFileRight] = useState<string | null>(null);
  const [selectedFileRightOrigin, setSelectedFileRightOrigin] = useState<string | null>(null); // Ajout pour la comparaison fiable des fichiers ipynb
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false);
  const [lastClickedType, setLastClickedType] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [toastId, setToastId] = useState<Id | null>(null); // Add this state
  const ipynbDivRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeRightRef = useRef<HTMLIFrameElement>(null); // Add new ref
  const hasAutoOpenedRef = useRef<boolean>(false); // Track if we've auto-opened from URL
  const [splitSizes, setSplitSizes] = useState([50, 50]);
  const [leftFileType, setLeftFileType] = useState<string | null>(null);
  const [iframeKeyLeft, setIframeKeyLeft] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUniqueId, setCurrentUniqueId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoOpenActivityFileUrl, setAutoOpenActivityFileUrl] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const [expanded, setExpanded] = useState(false);



  const standardActivities = useMemo(() => {
    if (!course) {
      return [] as Activity[];
    }
    // Get activityFileUrl from URL params to check if we need to include a hidden activity
    const activityFileUrlFromParams = searchParams.get('activityFileUrl');
    
    return course.activities.filter((activity) => {
      // Exclude file drop activities
      if (activity.isFileDrop) return false;
      
      // If activity is hidden, only include it if it's the one being accessed via URL
      if (activity.isHidden) {
        return activityFileUrlFromParams === activity.fileUrl;
      }
      
      return true;
    });
  }, [course, searchParams]);

  const fileDropActivities = useMemo(() => {
    if (!course) {
      return [] as Activity[];
    }
    return course.activities.filter((activity) => activity.isFileDrop && !activity.isHidden);
  }, [course]);

  // Dans le composant CoursePage, ajouter cette fonction pour grouper les activités
  // juste avant le return
  const groupedActivities = useMemo(() => {
  if (!standardActivities.length) return {};
  
  // Définir le type de l'objet groups pour permettre les propriétés dynamiques
  const groups: Record<string, Activity[]> = {};
  
  standardActivities.forEach(activity => {
    // Déterminer le type de fichier basé sur l'extension
    const extension = activity.name.split('.').pop()?.toLowerCase() || '';
    let fileType = 'Autres fichiers';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webmp'].includes(extension)) fileType = 'Images';
    if (['pdf'].includes(extension)) fileType = 'Documents PDF';
    if (['ipynb'].includes(extension)) fileType = 'Notebooks Python';
    if (['mp4', 'avi', 'mov'].includes(extension)) fileType = 'Vidéos';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension)) fileType = 'Audio';
    if (['html'].includes(extension)) fileType = 'Documents HTML';
    
    if (!groups[fileType]) {
      groups[fileType] = [];
    }
    groups[fileType].push(activity);
  });
  
  return groups;
  }, [standardActivities]);


  const handleUniqueIdReceived = (id: string) => {
    setCurrentUniqueId(id);
  };

  const handleOTPChange = (value: string) => {
    setCurrentUniqueId(value.toUpperCase());
  };

  // Dans le composant CoursePage, ajouter cette fonction
const handleActivityClick = async (fileUrl: string, activity: Activity) => {
  // Vérifier si l'activité est désactivée ou masquée
  if (activity.isDisabled || activity.isHidden) {
    toast.error('Cette activité est actuellement désactivée', {
      autoClose: 5000,
      style: {
        width: '380px',
        borderRadius: '8px',
        fontWeight: 'bold',
        textAlign: 'center',
      }
    });
    return;
  }

  // Déterminer le type de fichier AVANT toute action
  const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
  let type = 'other';
  if (["jpg", "jpeg", "png", "gif", "svg", "webmp"].includes(extension)) type = 'image';
  else if (["pdf"].includes(extension)) type = 'pdfType';
  else if (["ipynb"].includes(extension)) type = 'ipynb';
  else if (["mp4", "avi", "mov"].includes(extension)) type = 'video';
  else if (["mp3", "wav", "ogg", "aac", "flac"].includes(extension)) type = 'audio';
  else if (["html"].includes(extension)) type = 'html';
  else if (["txt", "rtf"].includes(extension)) type = 'txt';
  else if (["tsx", "jsx", "ts", "js", "css"].includes(extension)) type = 'typescript';

  // Vérifier si le fichier est déjà affiché (empêche toute action inutile)
  if ((type === 'ipynb' && selectedFileRightOrigin === fileUrl) || (type !== 'ipynb' && selectedFileLeftOrigin === fileUrl)) {
    return;
  }

  // Process the file URL through the API similar to how it's done in ActivityList
  if (["jpg", "jpeg", "png", "gif", "svg", "webmp"].includes(extension)) {
    type = 'image';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity, fileUrl); // Correction ici
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  } else if (["pdf"].includes(extension)) {
    type = 'pdfType';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity, fileUrl); // Correction ici
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  } else if (["ipynb"].includes(extension)) {
    type = 'ipynb';
    handleSelectActivity(fileUrl, type, activity);
  } else if (["mp4", "avi", "mov"].includes(extension)) {
    type = 'video';
    handleFileSelection(fileUrl, type, activity, fileUrl); // Correction ici
    handleSelectActivity(fileUrl, type, activity);
  } else if (["mp3", "wav", "ogg", "aac", "flac"].includes(extension)) {
    type = 'audio';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity, fileUrl); // Correction ici
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error('Erreur lors du téléchargement de l\'audio');
    }
  } else if (["html"].includes(extension)) {
    type = 'html';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity, fileUrl); // Correction ici
    } catch (error) {
      console.error("Error downloading HTML:", error);
      toast.error('Erreur lors du téléchargement du fichier HTML');
    }
  }  else if (["txt", "rtf"].includes(extension)) {
    type = 'txt';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const rawText = await response.text();
      let processedText = rawText;
      if (extension === 'rtf') {
        processedText = rawText.replace(/\\[a-z0-9]+\s?/g, '');
        const mainContentMatch = processedText.match(/\{[^\{]*\\pard[^\}]*\s+([^\\]+)/);
        if (mainContentMatch && mainContentMatch[1]) {
          processedText = mainContentMatch[1].trim();
        } else {
          processedText = processedText
            .replace(/\{[^\}]*\}/g, ' ')
            .replace(/\{|\}/g, '')
            .replace(/\\[a-z0-9]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        }
      }
      handleFileSelection(processedText, type, activity, fileUrl); // Correction ici
    } catch (error) {
      console.error("Error downloading text file:", error);
      toast.error('Erreur lors du téléchargement du fichier texte');
    }
  } else if (["tsx", "jsx", "ts", "js", "css"].includes(extension)) {
    type = 'typescript';
    handleSelectActivity(fileUrl, type, activity);
  } else {
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, 'other', activity, fileUrl); // Correction ici
      handleSelectActivity(objectUrl, 'other', activity);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error('Erreur lors du téléchargement du fichier');
    }
  }
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

  const handleFileSelection = (fileUrl: string, fileType: string, activity: Activity, originFileUrl?: string) => {
    if (fileType === 'pdfType' && isMobileDevice()) {
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
    setSelectedActivity(activity);
    setSelectedFileLeft(fileUrl);
    setLeftFileType(fileType);
    if (originFileUrl) {
      setSelectedFileLeftOrigin(originFileUrl);
    } else {
      setSelectedFileLeftOrigin(activity.fileUrl);
    }
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
  }, [courseId, router]);

  // Auto-open notebook from URL parameters
  useEffect(() => {
    const activityFileUrl = searchParams.get('activityFileUrl');
    if (activityFileUrl && course && !hasAutoOpenedRef.current) {
      // Find the activity with matching fileUrl
      const activity = course.activities.find(act => act.fileUrl === activityFileUrl);
      if (activity && activity.fileUrl.endsWith('.ipynb')) {
        // Mark as auto-opened to prevent infinite loops
        hasAutoOpenedRef.current = true;
        // Pass the fileUrl to ActivityList to handle the opening
        setAutoOpenActivityFileUrl(activityFileUrl);
      }
    }
  }, [course, searchParams]);

  const handleSelectActivity = (fileUrl: string, type: string, activity: Activity) => {
    if (type === 'ipynb') {
      setSelectedFileRight(fileUrl);
      setSelectedFileRightOrigin(activity.fileUrl); // Mise à jour de l'origine pour les fichiers ipynb
    } else {
      setSelectedFileLeft(fileUrl);
      setLeftFileType(type);
      setSelectedActivity(activity);
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
    setSelectedFileLeftOrigin(null);
    setSelectedFileRight(null);
    setSelectedFileRightOrigin(null);
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
  const handleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
      setShowFullscreenOverlay(false);
    } else {
      // Mettre le conteneur parent en plein écran au lieu de l'iframe
      const container = iframeRightRef.current?.parentElement;
      if (container && container.requestFullscreen) {
        container.requestFullscreen();
        setShowFullscreenOverlay(true);
      }
    } 
  };

  const handlePdfFullscreen = (containerId: string) => {
    if (isFullscreen) {
      document.exitFullscreen();
      setShowFullscreenOverlay(false);
    } else {
      const container = document.getElementById(containerId);
      if (container && container.requestFullscreen) {
        container.requestFullscreen();
        setShowFullscreenOverlay(true);
      }
    }
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
    if (uniqueIdCookie) {
      const uniqueIdValue = uniqueIdCookie.split('=')[1];
      setCurrentUniqueId(uniqueIdValue);
    }
  }, []);

  const handleVerifyNotebook = async () => {
    if (!currentUniqueId || currentUniqueId.length !== 6) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/verifyNotebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uniqueId: currentUniqueId }),
      });
      
      const data = await response.json();
      
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
        
        // Only update iframeRightRef
        if (iframeRightRef.current) {
          iframeRightRef.current.src = jupyterUrl;
        }
        if (selectedActivity) {
          handleSelectActivity(jupyterUrl, 'ipynb', selectedActivity);
        }
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
            data.message || 'Code introuvable...', 
            {
            className: "toast-centered",
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
              style: {
                width: '380px',
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                alignItems: 'center',
              },
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
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
          style: {
            width: '400px',
            borderRadius: '8px',
            fontWeight: 'bold',
            textAlign: 'center',
            alignItems: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreen = !!document.fullscreenElement;
      setIsFullscreen(fullscreen);
      if (!fullscreen) {
        setShowFullscreenOverlay(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  if (!course) {
    return <LoadingPage />;
  }

  const hasIpynb = standardActivities.some((activity) => activity.name.endsWith('.ipynb'));

  // Add this component inside CoursePage
  const MobileOpenButton = ({ url }: { url: string }) => (
    <Box sx={{ display: 'flex', height: '100%', alignItems: 'flex-start', justifyContent: 'center', p: 2 }}>
      <Button 
        onClick={() => window.open(url, '_blank')}
        variant="contained"
        sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '1.125rem' }}
      >
        <ExternalLink fontSize='medium' />
        Ouvrir dans un nouvel onglet
      </Button>
    </Box>
  );

  
  const DownloadButton = ({ fileUrl, title, fileType, activity, inStack = false }: { fileUrl: string, title: string, fileType?: string, activity?: Activity, inStack?: boolean }) => {
    const handleDownload = async () => {
      try {
        // --- RATE LIMIT PAR FICHIER ---
        const rateLimitKey = `downloadRateLimit_${activity?.fileUrl || fileUrl}`;
        const lastDownload = localStorage.getItem(rateLimitKey);
        const now = Date.now();
        const RATE_LIMIT_MS = 10000; // 10 secondes
        if (lastDownload && now - parseInt(lastDownload, 10) < RATE_LIMIT_MS) {
          toast.error('Patientez avant de retélécharger ce fichier !', {
            className: "toast-centered",
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
            style: {
              width: '400px',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
              alignItems: 'center',
            }
          });
          return;
        }
        localStorage.setItem(rateLimitKey, now.toString());
        // --- FIN RATE LIMIT ---
        // Pour les fichiers texte, le contenu est déjà chargé dans fileUrl
        if (fileType === 'txt' && typeof fileUrl === 'string' && !fileUrl.startsWith('http')) {
          // Créer un Blob à partir du texte
          const blob = new Blob([fileUrl], { type: 'text/plain;charset=utf-8' });
          
          // Déterminer le nom du fichier
          const extension = activity && activity.fileUrl.split('.').pop()?.toLowerCase();
          const fileName = title + (extension ? `.${extension}` : '.txt');
          
          // Créer un lien de téléchargement et le déclencher
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Message de succès
          toast.success(`Téléchargement de "${title}" démarré`, {
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
            style: {
              minWidth: '300px'
            }
          });
          return;
        }

        // Pour les vidéos, utiliser un lien direct via l'API interne
        if (fileType === 'video' && activity && activity.fileUrl) {
          const apiUrl = `/api/files${activity.fileUrl}`;
          const fileName = title || activity.fileUrl.split('/').pop() || 'video';
          // Créer un lien de téléchargement direct
          const downloadLink = document.createElement('a');
          downloadLink.href = apiUrl;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          toast.success(`Téléchargement de "${title}" démarré`, {
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
            style: {
              minWidth: '300px'
            }
          });
          return;
        }
        
        // Pour les autres fichiers, utiliser l'API pour éviter les erreurs CORS
        let apiUrl = fileUrl;
        // S'il s'agit d'une URL externe et qu'elle ne commence pas déjà par /api/files
        if (fileUrl.startsWith('http') && !fileUrl.includes('/api/files')) {
          if (activity && activity.fileUrl) {
            apiUrl = `/api/files${activity.fileUrl}`;
          }
        }
        const fileName = fileUrl.split('/').pop() || 'downloaded-file';
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = title || fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast.success(`Téléchargement de "${title}" démarré`, {
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
            style: {
              minWidth: '300px'
            }
          });
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
          toast.error('Erreur lors du téléchargement du fichier', {
            className: "toast-centered",
            autoClose: 5000,  // 5 seconds
            hideProgressBar: false, // Show progress bar
            style: {
              width: '400px',
              borderRadius: '8px',
              fontWeight: 'bold',
              textAlign: 'center',
              alignItems: 'center',
            }
          });
      }
    };

    return (
      <Button 
        onClick={handleDownload}
        className={inStack ? "bg-blue-600 hover:bg-blue-700" : "absolute top-0 right-0 z-10 m-2 bg-blue-600 hover:bg-blue-700"}
        size="small"
        variant="contained"
        sx={inStack ? { bgcolor: '#2563eb', '&:hover': { bgcolor: '#1d4ed8' } } : { 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          zIndex: 10, 
          m: 1,
          bgcolor: '#2563eb', 
          '&:hover': { bgcolor: '#1d4ed8' }
        }}
      >
        <Download sx={{ mr: 1, width: 16, height: 16 }} /> Télécharger
      </Button>
    );
  };


// Modifier le composant FileMetadata pour intégrer le lecteur audio
const FileMetadata = ({ activity, url }: { activity: Activity, url: string }) => {
  const [fileSize, setFileSize] = useState<string>("Chargement...");
  const [lastModified, setLastModified] = useState<string>("Chargement...");
  const fileName = activity.title || 'Fichier inconnu';
  const fileExtension = activity.fileUrl.split('.').pop()?.toLowerCase() || 'inconnu';
  const isAudioFile = ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(fileExtension);
  
  useEffect(() => {
    async function fetchFileMetadata() {
      try {
        // Extraire le chemin relatif du fichier à partir de l'URL
        const filePath = activity.fileUrl;
        
        // Appeler l'API pour obtenir les métadonnées
        const response = await fetch(`/api/file-metadata?filePath=${encodeURIComponent(filePath)}`);
        const data = await response.json();
        
        if (response.ok) {
          // Formater la taille du fichier
          const size = data.size;
          let formattedSize = "";
          if (size < 1024) {
            formattedSize = `${size} octets`;
          } else if (size < 1024 * 1024) {
            formattedSize = `${(size / 1024).toFixed(2)} Ko`;
          } else {
            formattedSize = `${(size / (1024 * 1024)).toFixed(2)} Mo`;
          }
          setFileSize(formattedSize);
          
          // Formater la date en français
          const date = new Date(data.lastModified);
          const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          };
          const formattedDate = new Intl.DateTimeFormat('fr-FR', options).format(date);
          setLastModified(formattedDate);
        } else {
          setFileSize("Information non disponible");
          setLastModified("Information non disponible");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des métadonnées:", error);
        setFileSize("Erreur de chargement");
        setLastModified("Erreur de chargement");
      }
    }
    
    fetchFileMetadata();
  }, [activity.fileUrl]);
  
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: '#f9fafb' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 768, width: '100%' }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#1f2937' }}>
          {activity.title}
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>Type de fichier</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>{fileExtension}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>Taille</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{fileSize}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#6b7280' }}>Dernière modification</Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{lastModified}</Typography>
          </Box>
          
          {isAudioFile && (
            <Box sx={{ mt: 3 }}>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Box 
                  sx={{ 
                    width: '100%',
                    maxWidth: 512,
                    borderRadius: 1,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                    bgcolor: '#f8f9fa',
                    p: 1.25,
                    height: 80,
                    display: 'flex',
                    alignContent: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <audio 
                  controls
                  className="w-full"
                  controlsList="nodownload"
                  preload="metadata"
                  style={{
                    backgroundColor: 'transparent',
                    borderRadius: '4px'
                  }}
                  >
                  <source src={url} type={`audio/${fileExtension}`} />
                  Votre navigateur ne prend pas en charge la lecture audio.
                  </audio>
                </Box>
              </Box>
            </Box>
          )}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#4b5563', mb: 2 }}>
              Ce fichier peut être téléchargé en utilisant le bouton ci-dessus.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}


  return (
    <div className="min-h-screen flex flex-col w-full md:max-w-[750px] lg:max-w-[960px] xl:max-w-[1400px] mx-auto px-4 md:px-0">
      <ActivityHeader title={course.title} description={course.description} />

      {fileDropActivities.length > 0 && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1 }}>
              Zones de dépôt ({fileDropActivities.length})
            </Typography>
          </Box>
          <Collapse in={expanded}>
            <Box sx={{ width: '100%' }}>
              {fileDropActivities.map((activity) => (
                <FileDropZone key={activity.id} activity={activity} courseId={course.id} />
              ))}
            </Box>
          </Collapse>
        </Box>
      )}

      {/* Adapter la structure en fonction du thème */}
      <div className={`
        ${course.themeChoice === 1 ? 'flex flex-col md:flex-row' : 'flex flex-col'} 
        w-full
      `}>
        {/* Afficher ActivityList seulement si themeChoice n'est pas 1 ou si hasIpynb est vrai */}
        {(course.themeChoice !== 1 || hasIpynb) && (
          <ActivityList
            themeChoice={course.themeChoice ?? 0}
            activities={standardActivities}
            onSelectActivity={handleSelectActivity}
            onToggleSideBySide={handleToggleSideBySide}
            handleFileSelection={handleFileSelection}
            userName={userName}
            setUserName={setUserName}
            onUniqueIdReceived={handleUniqueIdReceived}
            selectedFileLeftOrigin={selectedFileLeftOrigin}
            selectedFileRight={selectedFileRight}
            selectedFileRightOrigin={selectedFileRightOrigin}
            showSideBySide={showSideBySide}
            lastClickedType={lastClickedType}
            autoOpenActivityFileUrl={autoOpenActivityFileUrl}
          />
        )}

        {/* Afficher le contenu en pleine largeur si themeChoice === 1 et !hasIpynb */}



{course.themeChoice === 1 && !hasIpynb && (
  <div className="w-full">
    <div className="flex flex-wrap p-4"> {/* Changé de grid à flex avec flex-wrap */}
      {(() => {
        // Préparation des activités réparties équitablement
        const allActivities: Array<{groupName: string, activity: Activity}> = [];
        
        // Aplatir la structure pour obtenir toutes les activités avec leur type
        Object.entries(groupedActivities).forEach(([groupName, activities]) => {
          activities.forEach(activity => {
            allActivities.push({ groupName, activity });
          });
        });
        
        // Nombre total d'activités
        const totalActivities = allActivities.length;
        
        // Nombre de colonnes selon la taille d'écran
        const columnsCount = { sm: 2, md: 3 };
        
        // Nombre idéal d'activités par colonne (pour 3 colonnes)
        const itemsPerColumn = Math.ceil(totalActivities / columnsCount.md);
        
        // Diviser en 3 colonnes égales
        const columns: Array<{groupName: string, activity: Activity}[]> = [
          allActivities.slice(0, itemsPerColumn),
          allActivities.slice(itemsPerColumn, itemsPerColumn * 2),
          allActivities.slice(itemsPerColumn * 2)
        ];
        
        // Pour traquer le dernier type affiché entre les colonnes
        let lastGroupNameDisplayed = '';
        
        // Function to determine if an activity button should be disabled
        const shouldDisableActivity = (activity: Activity) => {
          // Si l'activité est masquée ou désactivée, elle est toujours désactivée
          if (activity.isDisabled || activity.isHidden) return true;
          
          if (showSideBySide) {
            // Double view mode: disable if either left or right document is this activity
            return (activity.fileUrl === selectedFileLeftOrigin) || (activity.fileUrl === selectedFileRightOrigin);
          } else {
            // Single view mode: disable only the currently active document based on lastClickedType
            if (lastClickedType === 'ipynb') {
              // If the last clicked was an ipynb file, only check the right side
              return activity.fileUrl === selectedFileRightOrigin && selectedFileRightOrigin !== null;
            } else {
              // If the last clicked was not an ipynb file, only check the left side
              return activity.fileUrl === selectedFileLeftOrigin && selectedFileLeftOrigin !== null;
            }
          }
        };
        
        // Rendre les colonnes
        return columns.map((column, colIndex) => {
          // Regrouper les activités par type dans cette colonne
          const groupedInColumn: Record<string, Activity[]> = {};
          
          column.forEach(({ groupName, activity }) => {
            if (!groupedInColumn[groupName]) {
              groupedInColumn[groupName] = [];
            }
            groupedInColumn[groupName].push(activity);
          });
          
          // Obtenir les entrées ordonnées pour préserver l'ordre original
          const entries = Object.entries(groupedInColumn);
          
          return (
            <React.Fragment key={`column-fragment-${colIndex}`}>
              {/* Colonne */}
              <div className="w-full sm:w-1/2 md:w-1/3 px-3 mb-6 md:mb-0 relative">
                <div className="space-y-6">
                  {entries.map(([groupName, activities], index) => {
                    // Ne pas afficher le groupName s'il s'agit du même type que celui affiché précédemment
                    // et qu'il s'agit du premier groupe de la colonne (continuité entre colonnes)
                    const shouldDisplayGroupName = !(index === 0 && groupName === lastGroupNameDisplayed);
                    
                    // Mettre à jour le dernier groupName affiché après traitement
                    if (index === entries.length - 1) {
                      lastGroupNameDisplayed = groupName;
                    }
                    
                    return (
                      <Box key={`${colIndex}-${groupName}`} sx={{ breakInside: 'avoid' }}>
                        {shouldDisplayGroupName && (
                          <Typography 
                            variant="h6" 
                            component="h3" 
                            sx={{ 
                              fontSize: '1rem',
                              fontWeight: 500, 
                              color: '#1f2937', 
                              borderBottom: '1px solid #d1d5db', 
                              pb: 0.5, 
                              mb: 1.5 
                            }}
                          >
                            {groupName}
                          </Typography>
                        )}
                        <Stack spacing={1}>
                          {activities.map((activity: Activity) => {
                            // Désactiver le bouton selon la logique single vs double vue
                            const isAlreadyDisplayed = shouldDisableActivity(activity);
                            return (
                              <Button
                                key={activity.id}
                                variant="outlined"
                                onClick={() => handleActivityClick(activity.fileUrl, activity)}
                                disabled={isAlreadyDisplayed}
                                sx={{ 
                                  width: '100%',
                                  justifyContent: 'space-between', 
                                  textTransform: 'none',
                                  textAlign: 'left',
                                  pl: 1,
                                  py: 0.75,
                                  mb: 1,
                                  '&:hover': { bgcolor: '#f9fafb' },
                                  ...(isAlreadyDisplayed && { opacity: 0.6, pointerEvents: 'none', cursor: 'not-allowed' })
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                                  <Box sx={{ flexShrink: 0, mr: 1 }}>
                                    {getFileIcon(activity.name)}
                                  </Box>
                                  <Typography 
                                    noWrap 
                                    sx={{ 
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}
                                    title={activity.title}
                                  >
                                    {activity.title}
                                  </Typography>
                                </Box>
                                {activity.isDisabled && (
                                  <RemoveCircleOutline sx={{ ml: 1, fontSize: 20, color: '#ef4444', flexShrink: 0 }} />
                                )}
                              </Button>
                            );
                          })}
                        </Stack>
                      </Box>
                    );
                  })}
                </div>
              </div>
              

            </React.Fragment>
          );
        });
      })()}
    </div>
  </div>
)}
        {/* Dans le mode accordéon ou si hasIpynb est vrai */}
        {(course.themeChoice !== 1 || hasIpynb) && (
          <Box sx={{ flex: course.themeChoice === 1 ? 1 : 'auto', width: course.themeChoice === 1 ? 'auto' : '100%' }}>
            {hasIpynb && (
              <>
                <Divider variant="middle" sx={{ mb: 2, borderBottomWidth: '1px' }} />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', xl: 'row' }, 
                    justifyContent: { xs: 'space-between', xl: 'space-between' }, 
                    alignItems: { xs: 'stretch', xl: 'center' },
                    p: 2,
                    gap: 2
                  }}
                >
                  <Box
                  sx = {{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    flexGrow: 1,
                    width: { xs: '100%', md: '100%' }
                  }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showSideBySide}
                          onChange={(e) => setShowSideBySide(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Double vue"
                      sx={{ justifyContent: 'flex-end', ml: 0, width: '100%' }}
                    />
                  </Box>

                  <Stack sx={{ 
                    gap: 2,
                    flexDirection: { xs: 'row', md: 'row', xl: 'column' },
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: { xs: '100%', md: '100%' } }}>
                    <TextField
                      className="inputNameActivityList"
                      type="text"
                      placeholder="Entrez votre prénom"
                      value={userName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                      onFocus={() => {
                        if (toastId) {
                          toast.dismiss();
                          toast.clearWaitingQueue();
                          setToastId(null);
                        }
                      }}
                      size="small"
                      variant="outlined"
                      fullWidth
                      sx={{ minWidth: { xs: 'auto', md: '200px' } }}
                    />
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
                  </Stack>
                  <Stack
                  sx = {{
                    flexDirection: { lg: 'column', xl: 'column' },
                    gap: 2,
                    width: '100%'
                  }}
                  >
                  <Stack spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <Button 
                      onClick={handleVerifyNotebook}
                      disabled={isLoading || !currentUniqueId || currentUniqueId.length !== 6}
                      variant="contained"
                      fullWidth
                    >
                      {isLoading ? 'Chargement...' : 'Charger un notebook'}
                    </Button>
                  </Stack>
                  <Button 
                    onClick={handleClearCookies} 
                    variant="contained"
                    fullWidth
                    sx={{ 
                      width: { xs: '100%', md: 'auto' },
                      bgcolor: '#fca5a5', 
                      color: 'white', 
                      '&:hover': { bgcolor: '#b91c1c' }
                    }}
                  >
                    Effacer vos données
                  </Button>
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        )}
      </div>

      {/* Le reste du code reste inchangé */}
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
            <div className="w-full h-full md:h-auto relative">
              {/* Bouton de téléchargement (sauf pour PDF et vidéo) */}
              {selectedFileLeft && selectedActivity && leftFileType !== 'video' && leftFileType !== 'pdfType' && 
                  <DownloadButton 
                  fileUrl={selectedFileLeft} 
                  title={selectedActivity?.title || ''}
                  fileType={leftFileType || ''}
                  activity={selectedActivity}
                />
              }
              
              {leftFileType === 'image' && selectedFileLeft && (
                <ImageZoom src={selectedFileLeft} />
              )}
              {leftFileType === 'video' && selectedFileLeft && (
                <VideoActions 
                  fileUrl={selectedFileLeft} 
                  fileName={selectedFileLeft.split('/').pop() || 'video'}
                />
              )}
              {leftFileType === 'pdfType' && selectedFileLeft && selectedActivity && (
                <div className="w-full h-full relative">
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 10 
                    }}
                  >
                    <Button 
                      onClick={() => handlePdfFullscreen('pdf-container-left')}
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                    >
                      <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                    </Button>
                    <DownloadButton 
                      fileUrl={selectedFileLeft} 
                      title={selectedActivity.title} 
                      fileType="pdfType"
                      activity={selectedActivity}
                      inStack={true}
                    />
                  </Stack>
                  <div id="pdf-container-left" className="w-full h-full relative">
                    <iframe 
                      key={iframeKeyLeft} 
                      src={selectedFileLeft} 
                      className="w-full h-full absolute inset-0"
                      style={{border: 'none'}}
                    />
                    {/* Bouton pour quitter le plein écran visible en permanence */}
                    {isFullscreen && (
                      <Button 
                        onClick={() => handlePdfFullscreen('pdf-container-left')}
                        variant="contained"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          zIndex: 10,
                          bgcolor: '#dc2626', 
                          '&:hover': { bgcolor: '#b91c1c' },
                          color: 'white'
                        }}
                      >
                        <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> Quitter le plein écran
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {leftFileType === 'html' && selectedFileLeft && (
                <iframe 
                  src={selectedFileLeft}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  sandbox="allow-scripts allow-same-origin"
                  title="HTML Preview"
                />
              )}
              {leftFileType === 'txt' && selectedFileLeft && (
                <div className="w-full h-full overflow-auto py-6 px-2 bg-white mt-8">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto break-words max-w-full">
                    {selectedFileLeft}
                  </pre>
                </div>
              )}
              {leftFileType === 'other' && selectedFileLeft && selectedActivity && (
                <FileMetadata activity={selectedActivity} url={selectedFileLeft} />
              )}
              {leftFileType === 'typescript' && selectedFileLeft && (
                <iframe 
                  srcDoc={sanitizeContent(selectedFileLeft)} 
                  style={{ width: '100%', height: '100%' }}
                  sandbox="allow-scripts"
                ></iframe>
              )}
              {leftFileType === 'audio' && selectedFileLeft && selectedActivity && (
                <FileMetadata activity={selectedActivity} url={selectedFileLeft} />
              )}
            </div>
            <div className="w-full h-full md:h-auto">
              {selectedFileRight && (
                <div className="w-full h-full relative" id="fullscreen-container">
                  <iframe 
                    ref={iframeRightRef} 
                    src={selectedFileRight} 
                    className="w-full h-full absolute inset-0"
                    style={{border: 'none'}}
                  />
                  <Button 
                    onClick={handleFullscreen}
                    variant="contained"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      zIndex: 10, 
                      m: 1,
                      bgcolor: '#16a34a', 
                      '&:hover': { bgcolor: '#15803d' }
                    }}
                  >
                    <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  </Button>
                  
                  {/* Overlay dans le conteneur */}
                  {showFullscreenOverlay && (
                    <div className="absolute inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
                      <Button 
                        onClick={handleFullscreen}
                        variant="contained"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          right: 16, 
                          zIndex: 10,
                          bgcolor: '#dc2626', 
                          '&:hover': { bgcolor: '#b91c1c' },
                          color: 'white',
                          pointerEvents: 'auto'
                        }}
                      >
                        <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> Quitter le plein écran
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Split>
        ) : (
          <>
            <div style={{ width: lastClickedType !== 'ipynb' && selectedFileLeft ? '100%' : '0%', height: '100%', display: selectedFileLeft && lastClickedType !== 'ipynb' ? 'block' : 'none' }} className="relative">
              {/* Bouton de téléchargement (sauf pour PDF et vidéo) */}
              {selectedFileLeft && selectedActivity && leftFileType !== 'video' && leftFileType !== 'pdfType' &&
                  <DownloadButton 
                  fileUrl={selectedFileLeft} 
                  title={selectedActivity.title} 
                  fileType={leftFileType || ''}
                  activity={selectedActivity}
                />
              }
              
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
              {leftFileType === 'pdfType' && selectedFileLeft && selectedActivity && (
                <div className="w-full h-full relative">
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      zIndex: 10 
                    }}
                  >
                    <Button 
                      onClick={() => handlePdfFullscreen('pdf-container-single')}
                      variant="contained"
                      size="small"
                      sx={{ bgcolor: '#16a34a', '&:hover': { bgcolor: '#15803d' } }}
                    >
                      <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                    </Button>
                    <DownloadButton 
                      fileUrl={selectedFileLeft} 
                      title={selectedActivity.title} 
                      fileType="pdfType"
                      activity={selectedActivity}
                      inStack={true}
                    />
                  </Stack>
                  <div id="pdf-container-single" className="w-full h-full relative">
                    <iframe 
                      key={iframeKeyLeft} 
                      src={selectedFileLeft} 
                      className="w-full h-full absolute inset-0"
                      style={{border: 'none'}}
                    />
                    {/* Bouton pour quitter le plein écran visible en permanence */}
                    {isFullscreen && (
                      <Button 
                        onClick={() => handlePdfFullscreen('pdf-container-single')}
                        variant="contained"
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          zIndex: 10,
                          bgcolor: '#dc2626', 
                          '&:hover': { bgcolor: '#b91c1c' },
                          color: 'white'
                        }}
                      >
                        <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> Quitter le plein écran
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {leftFileType === 'html' && selectedFileLeft && (
                <iframe 
                  src={selectedFileLeft}
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  sandbox="allow-scripts allow-same-origin"
                  title="HTML Preview"
                />
              )}
              {leftFileType === 'txt' && selectedFileLeft && (
                <div className="w-full h-full overflow-auto py-6 px-2 bg-white mt-8">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm overflow-x-auto break-words max-w-full">
                    {selectedFileLeft}
                  </pre>
                </div>
              )}
              {leftFileType === 'other' && selectedFileLeft && selectedActivity && (
                <FileMetadata activity={selectedActivity} url={selectedFileLeft} />
              )}
              {leftFileType === 'audio' && selectedFileLeft && selectedActivity && (
                <FileMetadata activity={selectedActivity} url={selectedFileLeft} />
              )}
            </div>
            <div
              ref={ipynbDivRef}
              className="ipynbDiv"
              style={{ width: lastClickedType === 'ipynb' && selectedFileRight ? '100%' : '0%', height: '100%', display: selectedFileRight && lastClickedType === 'ipynb' ? 'block' : 'none' }}>
              {selectedFileRight && (
                <div className="relative w-full h-full" id="fullscreen-container-single">
                  <iframe  ref={iframeRightRef} src={selectedFileRight} className="w-full h-full absolute inset-0" style={{border: 'none'}}></iframe>
                  <Button 
                    onClick={handleFullscreen}
                    variant="contained"
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      right: 0, 
                      zIndex: 10, 
                      m: 1,
                      bgcolor: '#16a34a', 
                      '&:hover': { bgcolor: '#15803d' }
                    }}
                  >
                    <FullscreenIcon sx={{ mr: 1, width: 16, height: 16 }} /> {isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}