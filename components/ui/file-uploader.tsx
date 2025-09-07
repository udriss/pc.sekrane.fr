'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, File, X, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { CloudUpload, PictureAsPdf, PhotoCamera } from '@mui/icons-material';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedFileTypes?: { [key: string]: string[] };
  maxFileSize?: number;
  selectedFile?: File | null;
  preview?: string | null;
  className?: string;
  fileType?: 'image' | 'pdf' | 'all';
  rejectedFile?: File | null;
  onRejectedFileRemove?: () => void;
}

export function FileUploader({
  onFileSelect,
  onFileRemove,
  acceptedFileTypes = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    'application/pdf': ['.pdf']
  },
  maxFileSize = 10 * 1024 * 1024, // 10MB
  selectedFile,
  preview,
  className,
  fileType,
  rejectedFile,
  onRejectedFileRemove
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    } else if (rejectedFiles.length > 0) {
      // Si pas de fichier accepté mais des fichiers rejetés
      const rejectedFile = rejectedFiles[0].file;
      // Vous pouvez appeler une fonction callback pour gérer les rejets
      console.log('Fichier rejeté:', rejectedFile.name, rejectedFiles[0].errors);
    }
    setIsDragOver(false);
  }, [onFileSelect]);

  const onDropRejected = useCallback((rejectedFiles: any[]) => {
    // Gérer les fichiers rejetés si nécessaire
    setIsDragOver(false);
  }, []);

  const onDragEnter = useCallback(() => {
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    onDragEnter,
    onDragLeave,
    accept: fileType === 'image' 
      ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'] }
      : fileType === 'pdf'
      ? { 'application/pdf': ['.pdf'] }
      : {
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
          'application/pdf': ['.pdf'],
          'text/csv': ['.csv'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
          'application/vnd.ms-excel': ['.xls'],
          'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
          'audio/*': ['.mp3', '.wav', '.ogg', '.aac', '.flac'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
          'application/vnd.oasis.opendocument.text': ['.odt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
          'text/plain': ['.txt']
        },
    maxSize: maxFileSize,
    multiple: false
  });

  const getIcon = () => {
    if (fileType === 'image') {
      return <PhotoCamera className="h-8 w-8 text-gray-400" />;
    }
    if (fileType === 'pdf') {
      return <PictureAsPdf className="h-8 w-8 text-gray-400" />;
    }
    return <CloudUpload className="h-8 w-8 text-gray-400" />;
  };

  const getAcceptText = () => {
    if (fileType === 'image') {
      return 'Images (JPG, PNG, GIF, WebP)';
    }
    if (fileType === 'pdf') {
      return 'Documents PDF';
    }
    return 'Fichiers (Images, PDF, CSV, XLSX, Vidéo, Audio, DOCX, ODT, PPTX, ODS, TXT)';
  };

  if (selectedFile && preview && fileType === 'image') {
    return (
      <div className={cn("relative border-2 border-dashed border-gray-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Image sélectionnée :</span>
          {onFileRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
        <div className="flex flex-col items-center">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="max-w-full max-h-48 rounded-lg shadow-md object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
          <p className="text-xs text-gray-500 mt-2">{selectedFile.name}</p>
        </div>
      </div>
    );
  }

  if (selectedFile && (fileType === 'pdf' || fileType === 'all')) {
    const isPdf = selectedFile.type === 'application/pdf';
    return (
      <div className={cn("relative border-2 border-dashed border-gray-200 rounded-lg p-4", className)}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Fichier sélectionné :</span>
          {onFileRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          {isPdf ? <PictureAsPdf className="h-8 w-8 text-red-600" /> : <File className="h-8 w-8 text-gray-600" />}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur si fichier rejeté
  if (rejectedFile) {
    return (
      <div className={cn("relative border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50", className)}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-red-700">Fichier rejeté :</span>
          {onRejectedFileRemove && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onRejectedFileRemove}
              className="h-6 w-6 p-0 hover:bg-red-200"
            >
              <X className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-3 p-3 bg-red-100 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900 line-through opacity-70">
              {rejectedFile.name}
            </p>
            <p className="text-xs text-red-600 font-medium">
              Format invalide - {getAcceptText()} uniquement
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-gray-400",
        isDragActive || isDragOver ? "border-blue-400 bg-blue-50" : "bg-gray-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="flex justify-center mb-4">
          {isDragActive || isDragOver ? (
            <CloudUpload className="h-8 w-8 text-blue-500" />
          ) : (
            getIcon()
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {isDragActive || isDragOver
              ? `Relâchez pour ajouter le ${fileType === 'image' ? 'image' : 'PDF'}`
              : `Glissez-déposez ${fileType === 'image' ? 'une image' : 'un PDF'} ici, ou cliquez pour sélectionner`}
          </p>
          <p className="text-xs text-gray-500">
            {getAcceptText()} - Max {Math.round(maxFileSize / 1024 / 1024)}MB
          </p>
        </div>
      </div>
    </div>
  );
}
