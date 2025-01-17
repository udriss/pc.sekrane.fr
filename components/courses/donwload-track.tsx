import { toast } from 'react-hot-toast';

export const downloadFileWithProgress = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    const toastId = toast.loading('Chargement du fichier...');
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        toast.loading(`Chargement du fichier à ${progress}%`, { id: toastId });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const objectUrl = window.URL.createObjectURL(blob);
        toast.success('Chargement terminé', { id: toastId });
        resolve(objectUrl);
      } else {
        toast.error('Erreur de chargement', { id: toastId });
        reject(new Error('Loading failed'));
      }
    };

    xhr.onerror = () => {
      toast.error('Erreur réseau', { id: toastId });
      reject(new Error('Network error'));
    };

    xhr.send();
  });
};