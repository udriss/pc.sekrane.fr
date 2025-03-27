"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DOMPurify from 'dompurify';
import ActivityHeader from "@/components/courses/activity-header";
import { ActivityList } from "@/components/courses/activity-list";
import { Course, Activity } from "@/lib/dataTemplate";
import NotFound from "@/app/not-found";
import LoadingPage from "@/app/loading";
import Split from 'react-split';
import ImageZoom from "@/components/courses/image-zoom";
import { VideoActions } from "@/components/courses/video-player";
import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { toast, Id } from 'react-toastify';
import OtpInput from 'react-otp-input';
import Divider from '@mui/material/Divider';
import { Download } from 'lucide-react';
import { getFileType, getFileIcon } from "@/components/utils/fileUtils"; 
import { downloadFileWithProgress } from '@/components/courses/donwload-track'; 

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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);



  // Dans le composant CoursePage, ajouter cette fonction pour grouper les activités
  // juste avant le return
const groupedActivities = useMemo(() => {
  if (!course) return {};
  
  // Définir le type de l'objet groups pour permettre les propriétés dynamiques
  const groups: Record<string, Activity[]> = {};
  
  course.activities.forEach(activity => {
    // Déterminer le type de fichier basé sur l'extension
    const extension = activity.name.split('.').pop()?.toLowerCase() || '';
    let fileType = 'Autres fichiers';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webmp'].includes(extension)) fileType = 'Images';
    if (['pdf'].includes(extension)) fileType = 'Documents PDF';
    if (['ipynb'].includes(extension)) fileType = 'Notebooks Python';
    if (['mp4', 'avi', 'mov'].includes(extension)) fileType = 'Vidéos';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension)) fileType = 'Audio';
    
    if (!groups[fileType]) {
      groups[fileType] = [];
    }
    groups[fileType].push(activity);
  });
  
  return groups;
}, [course]);


  const handleUniqueIdReceived = (id: string) => {
    setCurrentUniqueId(id);
  };

  const handleOTPChange = (value: string) => {
    setCurrentUniqueId(value.toUpperCase());
  };

  // Dans le composant CoursePage, ajouter cette fonction
const handleActivityClick = async (fileUrl: string, activity: Activity) => {
  // Determine file type
  const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
  let type = 'other';
  
  // Process the file URL through the API similar to how it's done in ActivityList
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webmp'].includes(extension)) {
    type = 'image';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity);
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error('Erreur lors du téléchargement de l\'image');
    }
  } else if (['pdf'].includes(extension)) {
    type = 'pdfType';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  } else if (['ipynb'].includes(extension)) {
    type = 'ipynb';
    handleSelectActivity(fileUrl, type, activity);
  } else if (['mp4', 'avi', 'mov'].includes(extension)) {
    type = 'video';
    handleFileSelection(fileUrl, type, activity);
    handleSelectActivity(fileUrl, type, activity);
  } else if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension)) {
    type = 'audio';
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, type, activity);
    } catch (error) {
      console.error("Error downloading audio:", error);
      toast.error('Erreur lors du téléchargement de l\'audio');
    }
  } else if (['tsx', 'jsx', 'ts', 'js', 'html', 'css'].includes(extension)) {
    type = 'typescript';
    handleSelectActivity(fileUrl, type, activity);
  } else {
    // Handle other file types
    const apiUrl = `/api/files${fileUrl}`;
    try {
      const objectUrl = await downloadFileWithProgress(apiUrl);
      handleFileSelection(objectUrl, 'other', activity);
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

  const handleFileSelection = (fileUrl: string, fileType: string, activity: Activity) => {
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

  const handleSelectActivity = (fileUrl: string, type: string, activity: Activity) => {
    if (type === 'ipynb') {
      setSelectedFileRight(fileUrl);
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

  
  const DownloadButton = ({ fileUrl, title }: { fileUrl: string, title: string }) => {
    const handleDownload = async () => {
      try {
        // Obtenir le nom du fichier à partir de l'URL pour le téléchargement
        const fileName = fileUrl.split('/').pop() || 'downloaded-file';
        
        // Télécharger le fichier
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Créer un lien de téléchargement et le déclencher
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = title || fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Utiliser le titre pour le message de succès
        toast.success(`Téléchargement de "${title}" démarré`);
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        toast.error('Erreur lors du téléchargement du fichier');
      }
    };

    return (
      <Button 
        onClick={handleDownload}
        className="absolute top-0 right-0 z-10 m-2 bg-blue-600 hover:bg-blue-700"
        size="sm"
      >
        <Download className="mr-2 h-4 w-4" /> Télécharger
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
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{activity.title}</h2>
        
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Type de fichier</span>
            <span className="text-base font-semibold uppercase">{fileExtension}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Taille</span>
            <span className="text-base font-semibold">{fileSize}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500">Dernière modification</span>
            <span className="text-base font-semibold">{lastModified}</span>
          </div>
          
          {isAudioFile && (
            <div className="mt-6">
              <div className="w-full flex justify-center">
                <div 
                  className="w-full max-w-md"
                  style={{ 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  backgroundColor: '#f8f9fa',
                  padding: '10px',
                  height: '80px',
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
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Ce fichier peut être téléchargé en utilisant le bouton ci-dessus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


  return (
    <div className="min-h-screen flex flex-col w-full md:max-w-[750px] lg:max-w-[960px] xl:max-w-[1400px] mx-auto px-4 md:px-0">
      <ActivityHeader title={course.title} description={course.description} />

      {/* Adapter la structure en fonction du thème */}
      <div className={`
        ${course.themeChoice === 1 ? 'flex flex-col md:flex-row' : 'flex flex-col'} 
        w-full
      `}>
        {/* Afficher ActivityList seulement si themeChoice n'est pas 1 ou si hasIpynb est vrai */}
        {(course.themeChoice !== 1 || hasIpynb) && (
          <ActivityList
            themeChoice={course.themeChoice ?? 0}
            activities={course.activities}
            onSelectActivity={handleSelectActivity}
            onToggleSideBySide={handleToggleSideBySide}
            handleFileSelection={handleFileSelection}
            userName={userName}
            setUserName={setUserName}
            onUniqueIdReceived={handleUniqueIdReceived}
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
                      <div key={`${colIndex}-${groupName}`} className="break-inside-avoid">
                        {shouldDisplayGroupName && (
                          <h3 className="text-md font-medium text-gray-800 border-b border-gray-300 pb-1 mb-3">
                            {groupName}
                          </h3>
                        )}
                        <div className="space-y-2 flex flex-col">
                          {activities.map((activity: Activity) => (
                            <Button
                              key={activity.id}
                              variant="outline"
                              className="w-full text-left pl-2 py-1.5 h-auto mb-2 hover:bg-gray-50 flex items-center"
                              onClick={() => handleActivityClick(activity.fileUrl, activity)}
                            >
                              <div className="flex items-center w-full">
                                <div className="flex-shrink-0 mr-2">
                                  {getFileIcon(activity.name)}
                                </div>
                                <span className="truncate block max-w-[calc(100%-24px)]" title={activity.title}>
                                  {activity.title}
                                </span>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
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
          <div className={`${course.themeChoice === 1 ? 'flex-1' : 'w-full'}`}>
            {hasIpynb && (
              <>
                <Divider variant="middle" sx={{ mb: 2, borderBottomWidth: '1px' }}></Divider>
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
              </>
            )}
          </div>
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
              {/* Bouton de téléchargement */}
              {selectedFileLeft && selectedActivity &&
                  <DownloadButton 
                  fileUrl={selectedFileLeft} 
                  title={selectedActivity?.title || ''}
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
              {leftFileType === 'pdfType' && selectedFileLeft && (
                <div className="w-full h-full relative">
                  <iframe 
                    key={iframeKeyLeft} 
                    src={selectedFileLeft} 
                    className="w-full h-full absolute inset-0"
                    style={{border: 'none'}}
                  />
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
            <div style={{ width: lastClickedType !== 'ipynb' && selectedFileLeft ? '100%' : '0%', height: '100%', display: selectedFileLeft && lastClickedType !== 'ipynb' ? 'block' : 'none' }} className="relative">
              {/* Bouton de téléchargement */}
              {selectedFileLeft && selectedActivity &&
                  <DownloadButton 
                  fileUrl={selectedFileLeft} 
                  title={selectedActivity.title} 
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
              {leftFileType === 'pdfType' && selectedFileLeft && (
                <iframe
                  key={iframeKeyLeft}
                  ref={iframeRef}
                  src={selectedFileLeft}
                  className="w-full h-full"
                  allowFullScreen
                />
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
                <iframe  ref={iframeRightRef} src={selectedFileRight} style={{ width: '100%', height: '100%' }}></iframe>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}