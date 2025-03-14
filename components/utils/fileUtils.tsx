import React from "react";
import { FaFileLines, FaFileImage, FaRegFilePdf, FaFileCode, FaFileVideo, FaPython } from "react-icons/fa6";
import { GiSoundWaves } from "react-icons/gi";


export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'webmp':
      return <FaFileImage className="mr-2 h-6 w-6" style={{ color: 'rgba(0, 102, 204, 0.8)' }} />;
    case 'pdf':
      return <FaRegFilePdf className="mr-2 h-6 w-6" style={{ color: 'rgb(202, 41, 41)' }} />;
    case 'ipynb':
          return <FaPython className="mr-2 h-6 w-6" style={{ color: 'rgb(236, 189, 24)' }} />;  
    case 'mp4':
    case 'avi':
    case 'mov':
      return <FaFileVideo className="mr-2 h-6 w-6" style={{ color: 'rgba(153, 0, 204, 0.8)' }} />;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'aac':
    case 'flac':
      return <GiSoundWaves className="mr-2 h-6 w-6" style={{ color: 'rgba(61, 148, 90, 0.82)' }} />;
    default:
      return <FaFileLines className="mr-2 h-6 w-6" style={{ color: 'gray' }} />;
  }
};

export const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webmp'].includes(extension || '')) return 'Images';
  if (['pdf'].includes(extension || '')) return 'Documents PDF';
  if (['ipynb'].includes(extension || '')) return 'Notebooks Python';
  if (['mp4', 'avi', 'mov'].includes(extension || '')) return 'Vidéos';
  if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(extension || '')) return 'Audio';
  return 'Autres fichiers';
};