import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MaterialIcon } from '@/components/ui/material-icon';
import Image from 'next/image';
import { CalendarMonth, VideoLibrary, PictureAsPdf } from '@mui/icons-material';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const getDatesWithProgression = () => {
    return progressions.map(p => new Date(p.date));
  };

  const getProgressionsForDate = (date: Date) => {
    return progressions.filter(p => {
      const progressionDate = new Date(p.date);
      return progressionDate.toDateString() === date.toDateString();
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateProgressions = getProgressionsForDate(date);
      if (dateProgressions.length > 0) {
        setSelectedProgressions(dateProgressions);
        setIsDialogOpen(true);
      }
    }
  };

  const renderContent = (progression: Progression) => {
    switch (progression.contentType) {
      case 'video':
        return (
          <div className="space-y-4">
            {progression.content && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }} 
              />
            )}
            {progression.resourceUrl && (
              <a 
                href={progression.resourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <VideoLibrary className="mr-2 h-4 w-4" />
                Regarder la vidéo
              </a>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            {progression.resourceUrl && (
              <div className="flex justify-center">
                <Image
                  src={progression.resourceUrl}
                  alt={progression.title}
                  width={800}
                  height={600}
                  className="max-w-full rounded-lg shadow-md object-contain"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}
            {progression.content && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }} 
              />
            )}
          </div>
        );
      case 'pdf':
        return (
          <div className="space-y-4">
            {progression.content && (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: progression.content }} 
              />
            )}
            {progression.resourceUrl && (
              <div className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                <div className="flex items-center justify-between p-4 bg-red-100 border-b border-red-200">
                  <div className="flex items-center space-x-2">
                    <PictureAsPdf className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Document PDF</span>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={progression.resourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Ouvrir
                    </a>
                    <a
                      href={progression.resourceUrl}
                      download
                      className="inline-flex items-center px-3 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
                <div className="bg-white">
                  <iframe
                    src={`${progression.resourceUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
                    width="100%"
                    height="300px"
                    className="border-0"
                    title="PDF Document"
                  />
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: progression.content }} 
          />
        );
    }
  };

  return (
    <>
      <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-purple-800 flex items-center">
              <CalendarMonth className="mr-2 h-5 w-5" />
              Progression - {classeName}
            </span>
            <Badge variant="secondary" className="bg-purple-200 text-purple-800">
              {progressions.length} entrées
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={fr}
              className="rounded-md border-purple-200"
              modifiers={{
                hasProgression: getDatesWithProgression()
              }}
              modifiersStyles={{
                hasProgression: {
                  backgroundColor: '#e9d5ff',
                  color: '#6b21a8',
                  fontWeight: 'bold'
                }
              }}
            />
          )}
          <p className="text-sm text-gray-600 mt-4 text-center">
            Cliquez sur une date en surbrillance pour voir les progressions
          </p>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] w-full">
          {selectedProgressions.length > 0 && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarMonth className="h-6 w-6 text-purple-600" />
                  Progressions du {format(new Date(selectedProgressions[0].date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </DialogTitle>
                <p className="text-sm text-gray-600">
                  {selectedProgressions.length} progression{selectedProgressions.length > 1 ? 's' : ''} disponible{selectedProgressions.length > 1 ? 's' : ''}
                </p>
              </DialogHeader>
              <ScrollArea className="mt-4 max-h-[60vh]">
                <div className="pr-4 space-y-6">
                  {selectedProgressions.map((progression, index) => (
                    <div key={progression.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-3">
                        <MaterialIcon 
                          name={progression.icon || 'edit'} 
                          className="h-5 w-5"
                          style={{ color: progression.iconColor || '#000' }}
                        />
                        <h3 className="text-lg font-semibold">{progression.title}</h3>
                        <Badge 
                          variant="outline" 
                          className="ml-auto"
                        >
                          {progression.contentType}
                        </Badge>
                      </div>
                      {renderContent(progression)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
