import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Grip } from 'lucide-react';

interface PropsSortableCourse {
  courseId: string;
  courseTitle: string;
  onDelete: (courseId: string) => void;
}

export function SortableCourse({ courseId, courseTitle, onDelete }: PropsSortableCourse) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: courseId,
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

      {/* Course title and delete logic */}
      <div className='flex-1 col-span-6 flex flex-col justify-start space-x-2'>
        <span className="truncate flex-1">{courseTitle}</span>
      </div>
      <div className="flex col-span-2 justify-around space-x-2 ml-2">
        {confirmDelete ? (
          <>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(courseId)}
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