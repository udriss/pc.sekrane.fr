'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, ExternalLink, Download } from 'lucide-react';
import { PictureAsPdf, OpenInNew, FileDownload } from '@mui/icons-material';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  src: string;
  filename?: string;
  onRemove?: () => void;
  className?: string;
  showControls?: boolean;
  isEmbedded?: boolean;
}

export function PDFViewer({
  src,
  filename,
  onRemove,
  className,
  showControls = true,
  isEmbedded = false
}: PDFViewerProps) {
  // Préfixer via l'API de fichiers si le chemin pointe vers /progressions
  const isProgressionStored = src.startsWith('/progressions/');
  const apiServedSrc = isProgressionStored ? `/api/files${src}` : src;

  const openInNewTab = () => {
    window.open(apiServedSrc, '_blank');
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = apiServedSrc;
    link.download = filename || 'document.pdf';
    link.click();
  };

  if (isEmbedded) {
    return (
      <Card className={cn("overflow-hidden border-red-200 bg-red-50", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <PictureAsPdf className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Document PDF</span>
              {filename && <Badge variant="outline" className="text-xs">{filename}</Badge>}
            </div>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-6 w-6 p-0 hover:bg-red-200"
              >
                <X className="h-4 w-4 text-red-600" />
              </Button>
            )}
          </div>

          {showControls && (
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={openInNewTab}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                <OpenInNew className="mr-2 h-4 w-4" />
                Ouvrir dans un nouvel onglet
              </Button>
              <Button
                onClick={downloadFile}
                size="sm"
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <FileDownload className="mr-2 h-4 w-4" />
                Télécharger
              </Button>
            </div>
          )}

          <div className="relative bg-white rounded-lg border border-red-200 overflow-hidden">
            <iframe
              src={`${apiServedSrc}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`}
              width="100%"
              height="400px"
              className="border-0"
              title={filename || "PDF Document"}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("border-2 border-dashed border-red-200 rounded-lg p-4 bg-red-50", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-sm font-medium text-red-800">Document PDF sélectionné</span>
          {filename && <p className="text-xs text-red-600">{filename}</p>}
        </div>
        {onRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 hover:bg-red-200"
          >
            <X className="h-4 w-4 text-red-600" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-red-200">
        <PictureAsPdf className="h-12 w-12 text-red-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {filename || 'document.pdf'}
          </p>
          <p className="text-xs text-gray-500">Document PDF</p>
        </div>
      </div>

      {showControls && (
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={openInNewTab}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Aperçu
          </Button>
          <Button
            onClick={downloadFile}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger
          </Button>
        </div>
      )}
    </div>
  );
}
