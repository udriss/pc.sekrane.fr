import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MaterialIcon } from '@/components/ui/material-icon';
import Image from 'next/image';
import { CalendarMonth, VideoLibrary, PictureAsPdf } from '@mui/icons-material';
import { Box, Grid, Paper, Typography, Chip, Button, CircularProgress } from '@mui/material';
interface Progression {
  id: string;
  date: Date;
  title: string;
  content: string;
  icon?: string;
  iconColor?: string;
  contentType: string;
  resourceUrl?: string;
}

interface ProgressionCardProps {
  classeId: string;
  classeName: string;
}

export function ProgressionCard({ classeId, classeName }: ProgressionCardProps) {
  const [progressions, setProgressions] = useState<Progression[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProgressions, setSelectedProgressions] = useState<Progression[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProgressions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progressions?classeId=${classeId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressions(data.progressions);
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
              <Button
                component="a"
                href={progression.resourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="inherit"
                sx={{ bgcolor: 'grey.900', color: 'common.white', '&:hover': { bgcolor: 'grey.800' } }}
                startIcon={<VideoLibrary className="h-4 w-4" />}
              >
                Regarder la vidéo
              </Button>
            )}
          </Box>
        );
      case 'image':
        return (
          <Box sx={{ '& > * + *': { mt: 2 } }}>
            {progression.resourceUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 960, aspectRatio: '4 / 3' }}>
                  <Image
                    src={progression.resourceUrl}
                    alt={progression.title}
                    fill
                    className="rounded-lg shadow-md object-contain"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority={false}
                  />
                </Box>
              </Box>
            )}
            {progression.content && (
              <Box
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }}
              />
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
                    <PictureAsPdf className="h-5 w-5" color="error" />
                    <Typography variant="body2" fontWeight={600} color="text.primary">Document PDF</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      component="a"
                      href={progression.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      color="inherit"
                      sx={{ bgcolor: 'grey.900', color: 'common.white', '&:hover': { bgcolor: 'grey.800' } }}
                      size="small"
                    >
                      Ouvrir
                    </Button>
                    <Button
                      component="a"
                      href={progression.resourceUrl}
                      download
                      variant="outlined"
                      color="inherit"
                      sx={{ borderColor: 'grey.700', color: 'grey.900', '&:hover': { borderColor: 'grey.900', bgcolor: 'grey.100' } }}
                      size="small"
                    >
                      Télécharger
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ bgcolor: 'white' }}>
                  <Box
                    component="iframe"
                    src={`${progression.resourceUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    sx={{ width: '100%', height: 300, border: 0 }}
                    title="PDF Document"
                  />
                </Box>
              </Box>
            )}
          </Box>
        );
      default:
        return (
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
            Progression — {classeName}
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
                  className="rounded-md border-gray-200 w-full"
                  classNames={{
                    months: 'w-full',
                    month: 'w-full',
                    table: 'w-full',
                    head_row: 'grid grid-cols-7 w-full',
                    head_cell: 'text-muted-foreground rounded-md font-normal text-[0.8rem] text-center',
                    row: 'grid grid-cols-7 w-full mt-2',
                    cell: 'p-0 relative min-h-[44px] sm:min-h-[52px] md:min-h-[60px]',
                    day: 'absolute inset-0 flex items-center justify-center !p-0 rounded-md m-1',
                    day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground border-2 border-blue-800 rounded-md',
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
                    },
                    selectedHasProgression: {
                      border: '2px solid #1e40af',
                      borderRadius: '4px',
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
                    {selectedProgressions.map((progression) => (
                      <Box key={progression.id} sx={{ pb: 3, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none', pb: 0 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          {progression.icon && progression.icon !== 'none' && (
                            <MaterialIcon
                              name={progression.icon}
                              className="h-5 w-5"
                              style={{ color: progression.iconColor || '#000' }}
                            />
                          )}
                          <Typography variant="subtitle1" fontWeight={600}>{progression.title}</Typography>
                        </Box>
                        {renderContent(progression)}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, textAlign: 'center', color: 'text.secondary' }}>
                Cliquez sur une date en surbrillance pour voir les progressions
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
