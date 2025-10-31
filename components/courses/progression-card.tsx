import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaterialIcon } from '@/components/ui/material-icon';
import Image from 'next/image';
import { CalendarMonth, VideoLibrary, PictureAsPdf } from '@mui/icons-material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Grid, Paper, Typography, Chip, Button, CircularProgress, Tooltip, IconButton, Stack, Collapse } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { FileDropZone } from '@/components/courses/file-drop-zone';
import type { Activity } from '@/lib/dataTemplate';
interface Progression {
  id: string;
  date: Date;
  title: string;
  content: string;
  icon?: string;
  iconColor?: string;
  contentType: string;
  resourceUrl?: string;
  imageSize?: number;
  activityId?: string;
  linkedActivityId?: string;
  linkedCourseId?: string;
}
import { cn, getApiFileUrl } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
interface ProgressionCardProps {
  classeId: string;
  classeName: string;
  initialDate?: Date;
  onDateChange?: (date: Date | undefined) => void;
}

// Modifier le composant FileMetadata pour intégrer le lecteur audio
const FileMetadata = ({ fileUrl, title, content }: { fileUrl: string, title: string, content?: string }) => {
  const [fileSize, setFileSize] = useState<string>("Chargement...");
  const [lastModified, setLastModified] = useState<string>("Chargement...");
  const fileExtension = fileUrl.split('.').pop()?.toLowerCase() || 'inconnu';
  const isAudioFile = ['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(fileExtension);
  
  useEffect(() => {
    async function fetchFileMetadata() {
      try {
        // Extraire le chemin relatif du fichier à partir de l'URL
        const filePath = fileUrl.replace('/api/files', ''); // Remove /api/files prefix if present
        
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
  }, [fileUrl]);
  
  return (
    <Box sx={{ width: '100%', p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280', textTransform: 'uppercase', fontWeight: 500 }}>
          .{fileExtension}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Taille: <span style={{ fontWeight: 600, color: '#374151' }}>{fileSize}</span>
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          Modifié: <span style={{ fontWeight: 600, color: '#374151' }}>{lastModified}</span>
        </Typography>
      </Box>
      
      {isAudioFile && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            width: '100%',
            maxWidth: 400,
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            bgcolor: '#f8f9fa',
            p: 1,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <audio 
              controls
              className="w-full"
              controlsList="nodownload"
              preload="metadata"
              style={{
                backgroundColor: 'transparent',
                borderRadius: '4px',
                height: '40px'
              }}
            >
              <source src={fileUrl} type={`audio/${fileExtension}`} />
              Votre navigateur ne prend pas en charge la lecture audio.
            </audio>
          </Box>
        </Box>
      )}
      
      <Box sx={{ textAlign: 'center' }}>
        <Button component="a" href={fileUrl} download variant="contained" color="primary" sx={{ fontWeight: 700 }}>
          Télécharger le fichier
        </Button>
      </Box>
      
      {content && (
        <Box sx={{ mt: 2 }}>
          <Box
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Box>
      )}
    </Box>
  );
}

export function ProgressionCard({ classeId, classeName, initialDate, onDateChange }: ProgressionCardProps) {
  const [progressions, setProgressions] = useState<Progression[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate ?? new Date());
  const [selectedProgressions, setSelectedProgressions] = useState<Progression[]>([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  // IDs des progressions dont le PDF est actuellement pré-visualisé
  const [openPdfIds, setOpenPdfIds] = useState<Set<string>>(new Set());
  // État pour contrôler l'expansion des zones de dépôt
  const [dropzoneExpanded, setDropzoneExpanded] = useState(false);

  const togglePdfPreview = (id: string) => {
    setOpenPdfIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const loadProgressions = useCallback(async () => {
    try {
      setLoading(true);
      const [progressionsRes, coursesRes] = await Promise.all([
        fetch(`/api/progressions?classeId=${classeId}`),
        fetch('/api/courses')
      ]);
      
      if (progressionsRes.ok) {
        const progressionData = await progressionsRes.json();
        setProgressions(progressionData.progressions);
      }
      
      if (coursesRes.ok) {
        const courseData = await coursesRes.json();
        setCourses(courseData.courses);
      }
    } catch (error) {
      console.error('Error loading progressions:', error);
    } finally {
      setLoading(false);
    }
  }, [classeId]);

  useEffect(() => {
    loadProgressions();
  }, [loadProgressions]);

  // Sync selected date when initialDate prop changes
  useEffect(() => {
    if (initialDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate]);

  const daysWithProgressionCount = useMemo(() => {
    const uniqueDays = new Set(
      progressions.map(p => new Date(p.date).toDateString())
    );
    return uniqueDays.size;
  }, [progressions]);

  const getDatesWithProgression = () => {
    return progressions.map(p => new Date(p.date));
  };

  const getProgressionsForDate = useCallback((date: Date) => {
    return progressions.filter(p => {
      const progressionDate = new Date(p.date);
      return progressionDate.toDateString() === date.toDateString();
    });
  }, [progressions]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (onDateChange) onDateChange(date);
  };

  // Keep right pane in sync with current date selection
  useEffect(() => {
    if (selectedDate) {
      setSelectedProgressions(getProgressionsForDate(selectedDate));
    } else {
      setSelectedProgressions([]);
    }
  }, [selectedDate, progressions, getProgressionsForDate]);

  const renderContent = (progression: Progression) => {
    const effectiveActivityId = progression.activityId || progression.linkedActivityId;
    const linkedCourse = effectiveActivityId ? courses.find(c => c.activities?.some((a: any) => a?.id === effectiveActivityId)) : null;
    const linkedActivity = effectiveActivityId && linkedCourse ? linkedCourse.activities.find((a: any) => a?.id === effectiveActivityId) : null;
    const isLinkedActivityDeleted = !!effectiveActivityId && !linkedActivity;

    const renderActivity = () => {
      if (!linkedActivity) {
        return (
          <Box sx={{ p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', borderRadius: 1 }}>
            <Typography variant="body2" color="error.main">
              L&apos;activité associée à cette progression a été supprimée.
            </Typography>
          </Box>
        );
      }
      const fileUrl: string = linkedActivity.fileUrl || '';
      const apiUrl = `/api/files${fileUrl}`;
      const ext = (fileUrl.split('.').pop() || '').toLowerCase();
      const isImage = ['png','jpg','jpeg','gif','webp','svg'].includes(ext);
      const isPdf = ext === 'pdf';
      const isVideo = ['mp4','webm','ogg','avi','mov'].includes(ext);
      const isAudio = ['mp3','wav','ogg','aac','flac'].includes(ext);
      const isHtml = ext === 'html';
      const isTxt = ['txt','rtf'].includes(ext);
      const isIpynb = ext === 'ipynb';
      const imageSize = progression.imageSize || 60;
      const maxWidth = 960;
      const currentWidth = (maxWidth * imageSize) / 100;

      return (
        <Box sx={{ '& > * + *': { mt: 2 } }}>
          {progression.content && (
            <Box
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: progression.content }}
            />
          )}
          {isImage && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: `${currentWidth}px`, maxWidth: '100%', aspectRatio: '4 / 3' }}>
                <Image
                  src={apiUrl}
                  alt={linkedActivity.title}
                  fill
                  className="rounded-lg shadow-md object-contain"
                  sizes={`${currentWidth}px`}
                />
              </Box>
            </Box>
          )}
          {isPdf && (
            <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PictureAsPdf className="h-5 w-5" color="error" />
                  <Typography variant="body2" fontWeight={600}>Document PDF</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button component="a" href={apiUrl} target="_blank" rel="noopener noreferrer" variant="contained" color="inherit" size="small">Ouvrir</Button>
                  <Button
                    variant={openPdfIds.has(`activity-pdf-${progression.id}`) ? 'contained' : 'outlined'}
                    color="primary"
                    size="small"
                    onClick={() => togglePdfPreview(`activity-pdf-${progression.id}`)}
                  >
                    {openPdfIds.has(`activity-pdf-${progression.id}`) ? 'Masquer' : 'Aperçu'}
                  </Button>
                  <Button component="a" href={apiUrl} download variant="outlined" color="inherit" size="small" sx = {{ fontWeight: 700 }}>Télécharger</Button>
                </Box>
              </Box>
              {openPdfIds.has(`activity-pdf-${progression.id}`) && (
                <Box sx={{ bgcolor: 'white' }}>
                  <Box component="iframe" src={`${apiUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`} sx={{ width: '100%', height: 300, border: 0 }} title="PDF Document" />
                </Box>
              )}
            </Box>
          )}
          {isVideo && (
            <Button component="a" href={apiUrl} target="_blank" rel="noopener noreferrer" variant="contained" color="inherit" startIcon={<VideoLibrary className="h-4 w-4" />}>Regarder la vidéo</Button>
          )}
          {isAudio && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <audio controls className="w-full">
                <source src={apiUrl} />
                Votre navigateur ne prend pas en charge l&apos;audio.
              </audio>
            </Box>
          )}
          {isHtml && (
            <Box sx={{ position: 'relative', pt: '56.25%' }}>
              <Box component="iframe" src={apiUrl} sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} sandbox="allow-scripts allow-same-origin" />
            </Box>
          )}
          {isTxt && (
            <Button component="a" href={apiUrl} target="_blank" rel="noopener noreferrer" variant="outlined">Ouvrir le texte</Button>
          )}
          {isIpynb && linkedCourse && (
            <Button component="a" href={`/courses/${linkedCourse.id}`} variant="contained" color="primary">Ouvrir l&apos;activité (Notebook)</Button>
          )}
          {linkedActivity.dropzoneConfig && linkedCourse && (
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <IconButton
                  onClick={() => setDropzoneExpanded(!dropzoneExpanded)}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {dropzoneExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  Zone de dépôt
                </Typography>
              </Box>
              <Collapse in={dropzoneExpanded}>
                <FileDropZone activity={linkedActivity} courseId={linkedCourse.id} />
              </Collapse>
            </Box>
          )}
          {!isImage && !isPdf && !isVideo && !isAudio && !isHtml && !isTxt && !isIpynb && !linkedActivity.dropzoneConfig && (
            <FileMetadata fileUrl={apiUrl} title={linkedActivity.title} content={progression.content} />
          )}
        </Box>
      );
    };

    if (progression.contentType === 'activity' || !!progression.activityId) {
      return renderActivity();
    }

    switch (progression.contentType) {
      case 'video':
        return (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            {progression.content && (
              <Box
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }}
              />
            )}
            {progression.resourceUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                  position: 'relative', 
                  width: '100%', 
                  maxWidth: '800px',
                  bgcolor: 'black',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  {isLinkedActivityDeleted ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%',
                      height: '300px',
                      bgcolor: 'grey.100',
                      color: 'text.disabled'
                    }}>
                      <Typography variant="body1">
                        Vidéo indisponible - activité supprimée
                      </Typography>
                    </Box>
                  ) : (
                    <video
                      src={getApiFileUrl(progression.resourceUrl)}
                      controls
                      style={{ 
                        width: '100%', 
                        height: 'auto',
                        maxHeight: '500px'
                      }}
                      preload="metadata"
                    >
                      Votre navigateur ne prend pas en charge la lecture de vidéos.
                    </video>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      case 'url':
        return (
          <Box sx={{ '& > * + *': { mt: 1.5 } }}>
            {progression.content && (
              <Box
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }}
              />
            )}
            {progression.resourceUrl && (
              <Button
                component="a"
                href={progression.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="primary"
                sx={{ textTransform: 'none', maxWidth: '100%', justifyContent: 'flex-start' }}
              >
                {progression.resourceUrl.length > 60 ? progression.resourceUrl.slice(0, 57) + '…' : progression.resourceUrl}
              </Button>
            )}
          </Box>
        );
      case 'image':
        const imageSize = progression.imageSize || 60; // Valeur par défaut si non définie
        const maxWidth = 960; // Largeur maximale de référence
        const currentWidth = (maxWidth * imageSize) / 100;
        
        return (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            {progression.content && (
              <Box
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }}
              />
            )}
            {progression.resourceUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ 
                  position: 'relative', 
                  width: `${currentWidth}px`, 
                  maxWidth: '100%',
                  aspectRatio: '4 / 3' 
                }}>
                  {isLinkedActivityDeleted ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '100%',
                      height: '100%',
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      color: 'text.disabled',
                      boxShadow: 1
                    }}>
                      <Typography variant="body1">
                        Image indisponible - activité supprimée
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      component="img"
                      src={getApiFileUrl(progression.resourceUrl)}
                      alt={progression.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: 1,
                        boxShadow: 2
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        );
      case 'pdf':
        return (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            {progression.content && (
              <Box
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }}
              />
            )}
            {progression.resourceUrl && (
              <Box sx={{ border: '1px solid', borderColor: 'grey.300', borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.100', borderBottom: '1px solid', borderColor: 'grey.300' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PictureAsPdf 
                      className="h-5 w-5" 
                      color={isLinkedActivityDeleted ? "disabled" : "error"} 
                    />
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      color={isLinkedActivityDeleted ? "text.disabled" : "text.primary"}
                    >
                      {isLinkedActivityDeleted ? 'Document PDF indisponible' : 'Document PDF'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component="a"
                      href={isLinkedActivityDeleted ? undefined : getApiFileUrl(progression.resourceUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      color="inherit"
                      disabled={!!isLinkedActivityDeleted}
                      sx={{ 
                        bgcolor: isLinkedActivityDeleted ? 'grey.400' : 'grey.900', 
                        color: isLinkedActivityDeleted ? 'grey.600' : 'common.white', 
                        '&:hover': { bgcolor: isLinkedActivityDeleted ? 'grey.400' : 'grey.800' } 
                      }}
                      size="small"
                    >
                      Ouvrir
                    </Button>
                    <Button
                      variant={openPdfIds.has(`pdf-${progression.id}`) ? 'contained' : 'outlined'}
                      color="primary"
                      size="small"
                      onClick={() => togglePdfPreview(`pdf-${progression.id}`)}
                      disabled={!!isLinkedActivityDeleted}
                    >
                      {openPdfIds.has(`pdf-${progression.id}`) ? 'Masquer' : 'Aperçu'}
                    </Button>
                    <Button
                      component="a"
                      href={isLinkedActivityDeleted ? undefined : getApiFileUrl(progression.resourceUrl)}
                      download={isLinkedActivityDeleted ? false : true}
                      variant="outlined"
                      color="inherit"
                      disabled={!!isLinkedActivityDeleted}
                      sx={{ 
                        fontWeight: 700,
                        borderColor: isLinkedActivityDeleted ? 'grey.400' : 'grey.700', 
                        color: isLinkedActivityDeleted ? 'grey.600' : 'grey.900', 
                        '&:hover': { 
                          borderColor: isLinkedActivityDeleted ? 'grey.400' : 'grey.900', 
                          bgcolor: isLinkedActivityDeleted ? 'transparent' : 'grey.100' 
                        } 
                      }}
                      size="small"
                    >
                      Télécharger
                    </Button>
                  </Box>
                </Box>
                {openPdfIds.has(`pdf-${progression.id}`) && (
                  <Box sx={{ bgcolor: 'white' }}>
                    {isLinkedActivityDeleted ? (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: 300, 
                        bgcolor: 'grey.100',
                        color: 'text.disabled'
                      }}>
                        <Typography variant="body1">
                          Document indisponible - activité supprimée
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        component="iframe"
                        src={`${getApiFileUrl(progression.resourceUrl)}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                        sx={{ width: '100%', height: 300, border: 0 }}
                        title="PDF Document"
                      />
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      default:
        return progression.resourceUrl ? <FileMetadata fileUrl={getApiFileUrl(progression.resourceUrl)} title={progression.title} content={progression.content} /> : (
          <Box
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: progression.content }}
          />
        );
    }
  };

  return (
    <Paper elevation={2} sx={{ height: '100%', bgcolor: 'common.white', border: '1px solid', borderColor: 'grey.200' }}>
      <Box sx={{ pb: 1.5, px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
            <CalendarMonth className="mr-2 h-5 w-5" />

            <Typography component="span" variant='body2'>Classe de&nbsp;</Typography>
            <Typography component="span" variant='body2' fontWeight="bold" color='primary'>{classeName}</Typography>
            <Tooltip title="Ouvrir la page de la classe">
              <IconButton 
                size="small" 
                onClick={() => window.open(`/classes/${classeId}`, '_blank')}
                sx={{ ml: 1 }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Chip label={`${daysWithProgressionCount} progression${daysWithProgressionCount > 1 ? 's' : ''}`} variant="outlined" />
        </Box>
      </Box>
      <Box sx={{ px: 2, pb: 2 }}>
        <Grid container spacing={3}>
          {/* Calendar Column */}
          <Grid size={{ xs: 12, md: 12, lg: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 256, width: '100%', color: 'grey.600' }}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={fr}
                  classNames={{

                    table: 'w-full',
                    head_row: 'grid grid-cols-7 w-full',
                    head_cell: 'text-muted-foreground rounded-md font-normal text-[0.8rem] text-center',
                    row: 'grid grid-cols-7 w-full mt-2',
                    cell: 'p-1 relative min-h-[25px] sm:min-h-[35px] md:min-h-[45px] h-full',
                    day: cn(
                      buttonVariants({ variant: 'ghost' }),
                      'w-full h-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors'
                    ),
                    day_selected: 'border-2 border-[#1e40af] rounded',
                  }}
                  modifiers={{
                    hasProgression: getDatesWithProgression(),
                    selectedHasProgression: selectedDate ? getDatesWithProgression().filter(d => d.toDateString() === selectedDate.toDateString()) : [],
                  }}
                  modifiersStyles={{
                    hasProgression: {
                      backgroundColor: '#9fcbf8ff',
                      color: '#111827',
                      fontWeight: 'bold',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    selectedHasProgression: {
                      border: '2px solid #1e40af',
                      borderRadius: '4px',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  }}
                />
              )}
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid size={{ xs: 12, md: 12, lg: 8 }}>
            {selectedDate && selectedProgressions.length > 0 ? (
              <>
                <Box sx={{ mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarMonth className="h-6 w-6 text-purple-600" />
                    <Typography variant="h6" component="h2">
                      {`${format(new Date(selectedProgressions[0].date), 'EEEE dd MMMM yyyy', { locale: fr })}`}
                    </Typography>
                    {/* <Chip label={`${selectedProgressions.length} entrée${selectedProgressions.length > 1 ? 's' : ''}`} variant="outlined" sx={{ ml: 'auto' }} /> */}
                  </Box>
                </Box>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 2 }}>
                    <Box sx={{ '& > * + *': { mt: 3 } }}>
                    {selectedProgressions.map((progression) => {
                      const effectiveActivityId = progression.activityId || progression.linkedActivityId;
                      const linkedActivity = effectiveActivityId 
                      ? courses.flatMap(c => c.activities).find(a => a?.id === effectiveActivityId)
                      : null;
                      const linkedCourse = progression.linkedCourseId
                      ? courses.find(c => c.id === progression.linkedCourseId)
                      : null;
                      const activityExists = linkedActivity !== undefined && linkedActivity !== null;

                      return (
                      <Box key={progression.id} sx={{ pb: 3, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        {progression.icon && progression.icon !== 'none' && (
                          <MaterialIcon
                          name={progression.icon}
                          className="h-5 w-5"
                          style={{ color: progression.iconColor || '#000' }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {progression.title}
                          {(progression.activityId || progression.contentType === 'activity') && (
                          <Tooltip title="Réutilisation d’une activité existante">
                            <HistoryIcon fontSize="small" color="action" />
                          </Tooltip>
                          )}
                        </Typography>
                        
                          {/* {(progression.linkedActivityId || progression.activityId) && (
                          <Chip 
                          label={activityExists ? `Activité: ${linkedActivity?.title}` : 'Activité supprimée'} 
                          variant="outlined" 
                          size="small"
                          color={activityExists ? 'primary' : 'error'}
                          sx={{ ml: 'auto' }} 
                          />
                        )} */}
                        </Box>
                          
                          {(progression.linkedActivityId || progression.activityId) && !activityExists && (
                            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', borderRadius: 1 }}>
                              <Typography variant="body2" color="error.main">
                                L&apos;activité associée à cette progression a été supprimée.
                                {linkedCourse && ` Elle faisait partie du cours "${linkedCourse.title}".`}
                              </Typography>
                            </Box>
                          )}
                          
                          {renderContent(progression)}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </>
            ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="overline">Cliquez sur une date en surbrillance pour voir les progressions</Typography>
                </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
