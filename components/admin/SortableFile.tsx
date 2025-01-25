import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Grip } from 'lucide-react';

interface PropsSortableFile {
  fileUrl: string;
  fileName?: string;
  onDelete: (fileUrl: string) => void;
}

export function SortableFile({ fileUrl, fileName, onDelete }: PropsSortableFile) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: fileUrl,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center grid grid-cols-9 justify-between p-2 bg-white rounded-md">
      {/* Drag handle section */}
      <div {...attributes} {...listeners} className="cursor-move select-none mr-2">
      <Grip strokeWidth={2.25} absoluteStrokeWidth />
      </div>

      {/* File name and delete logic */}
      <div className='flex-1 col-span-6 flex flex-col justify-start space-x-2'>
      <span className="truncate flex-1">{fileName}</span>
      <h4 className="truncate text-sm text-gray-500">{fileUrl}</h4>
      </div>
      <div className="flex col-span-2 justify-around space-x-2 ml-2">
        {confirmDelete ? (
          <>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(fileUrl)}
            >
              ✓
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className='hover:bg-green-200'
              onClick={() => setConfirmDelete(false)}
            >
              ✕
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmDelete(true)}
          >
            Supprimer
          </Button>
        )}
      </div>
    </li>
  );
}