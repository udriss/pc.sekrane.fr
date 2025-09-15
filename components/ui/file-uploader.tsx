import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Box, Typography, IconButton } from '@mui/material';
import { CloudUpload, PictureAsPdf, PhotoCamera, ErrorOutline, Close, InsertDriveFile } from '@mui/icons-material';
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
  onFileReject?: (file: File, errors: any[]) => void;
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
  onRejectedFileRemove,
  onFileReject
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
      if (onFileReject) {
        onFileReject(rejectedFile, rejectedFiles[0].errors);
      }
    }
    setIsDragOver(false);
  }, [onFileSelect, onFileReject]);

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
          'text/plain': ['.txt'],
          'application/x-ipynb+json': ['.ipynb'],
        },
    maxSize: maxFileSize,
    multiple: false
  });

  const getIcon = () => {
    if (fileType === 'image') {
      return <PhotoCamera sx={{ fontSize: 32, color: 'gray.400' }} />;
    }
    if (fileType === 'pdf') {
      return <PictureAsPdf sx={{ fontSize: 32, color: 'gray.400' }} />;
    }
    return <CloudUpload sx={{ fontSize: 32, color: 'gray.400' }} />;
  };

  const getAcceptText = () => {
    if (fileType === 'image') {
      return 'Images (JPG, PNG, GIF, WebP)';
    }
    if (fileType === 'pdf') {
      return 'Documents PDF';
    }
    return 'Fichiers (Images, PDF, CSV, XLSX, Vidéo, Audio, DOCX, ODT, PPTX, ODS, TXT, IPYNB)';
  };

  if (selectedFile && preview && fileType === 'image') {
    return (
      <Box className={cn("relative border-2 border-dashed border-gray-200 rounded-lg p-4", className)}>
        <Box className="flex items-center justify-between mb-3">
          <Typography variant="body2" fontWeight="medium" color="text.secondary">Image sélectionnée :</Typography>
          {onFileRemove && (
            <IconButton
              size="small"
              onClick={onFileRemove}
              sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <Close sx={{ fontSize: 16, color: 'red.500' }} />
            </IconButton>
          )}
        </Box>
        <Box className="flex flex-col items-center">
          <Image
            src={preview}
            alt="Preview"
            width={300}
            height={200}
            className="max-w-full max-h-48 rounded-lg shadow-md object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>{selectedFile.name}</Typography>
        </Box>
      </Box>
    );
  }

  if (selectedFile && (fileType === 'pdf' || fileType === 'all')) {
    const isPdf = selectedFile.type === 'application/pdf';
    return (
      <Box className={cn("relative border-2 border-dashed border-gray-200 rounded-lg p-4", className)}>
        <Box className="flex items-center justify-between mb-3">
          <Typography variant="body2" fontWeight="medium" color="text.secondary">Fichier sélectionné :</Typography>
          {onFileRemove && (
            <IconButton
              size="small"
              onClick={onFileRemove}
              sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <Close sx={{ fontSize: 16, color: 'red.500' }} />
            </IconButton>
          )}
        </Box>
        <Box className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          {isPdf ? <PictureAsPdf sx={{ fontSize: 32, color: 'red.600' }} /> : <InsertDriveFile sx={{ fontSize: 32, color: 'gray.600' }} />}
          <Box className="flex-1">
            <Typography variant="body2" fontWeight="medium" color="text.primary">{selectedFile.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Affichage de l'erreur si fichier rejeté
  if (rejectedFile) {
    return (
      <Box className={cn("relative border-2 border-dashed border-red-300 rounded-lg p-4 bg-red-50", className)}>
        <Box className="flex items-center justify-between mb-3">
          <Typography variant="body2" fontWeight="medium" color="error.main">Fichier rejeté :</Typography>
          {onRejectedFileRemove && (
            <IconButton
              size="small"
              onClick={onRejectedFileRemove}
              sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
            >
              <Close sx={{ fontSize: 16, color: 'red.600' }} />
            </IconButton>
          )}
        </Box>
        <Box className="flex items-center space-x-3 p-3 bg-red-100 rounded-lg">
          <ErrorOutline sx={{ fontSize: 32, color: 'red.600' }} />
          <Box className="flex-1">
            <Typography variant="body2" fontWeight="medium" color="error.dark" sx={{ textDecoration: 'line-through', opacity: 0.7 }}>
              {rejectedFile.name}
            </Typography>
            <Typography variant="caption" color="error.main" fontWeight="medium">
              Format invalide - {getAcceptText()} uniquement
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-lg p-6 transition-all duration-200 cursor-pointer hover:border-gray-400",
        isDragActive || isDragOver ? "border-blue-400 bg-blue-50" : "bg-gray-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <Box className="text-center">
        <Box className="flex justify-center mb-4">
          {isDragActive || isDragOver ? (
            <CloudUpload sx={{ fontSize: 32, color: 'blue.500' }} />
          ) : (
            getIcon()
          )}
        </Box>
        <Box className="space-y-2">
          <Typography variant="body2" color="text.secondary">
            {isDragActive || isDragOver
              ? `Relâchez pour ajouter le ${fileType === 'image' ? 'image' : 'PDF'}`
              : `Glissez-déposez ${fileType === 'image' ? 'une image' : 'un PDF'} ici, ou cliquez pour sélectionner`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getAcceptText()} - Max {Math.round(maxFileSize / 1024 / 1024)}MB
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
