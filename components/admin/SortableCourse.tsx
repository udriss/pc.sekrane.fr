import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';import { Visibility } from '@mui/icons-material';
import Switch from '@mui/material/Switch';
import { TbEyeClosed } from "react-icons/tb";
import { Tooltip, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface PropsSortableCourse {
  courseId: string;
  courseTitle: string;
  toggleVisibilityCourse?: boolean;
  onDelete: (courseId: string) => void;
  onToggleVisibility: (courseId: string, visibility: boolean) => void;
}

export function SortableCourse({ 
  courseId, 
  courseTitle, 
  toggleVisibilityCourse = true,
  onDelete,
  onToggleVisibility 
}: PropsSortableCourse) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: courseId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="grid grid-cols-12 items-center justify-between p-2 bg-white rounded-md">
      <div {...attributes} {...listeners} className="cursor-move select-none mr-2">
        <DragIndicatorIcon fontSize='medium' />
      </div>

      <div className='flex-1 col-span-6 flex flex-col justify-start space-x-2'>
        <span className="truncate flex-1">{courseTitle}</span>
      </div>

      <div className="flex col-span-2 items-center">
      <h4 className="text-sm font-medium text-gray-500 mr-2">
          {toggleVisibilityCourse ? (
            <Visibility className="text-green-600" />
          ) : (
            <TbEyeClosed className="h-6 w-6 text-red-600" />            
          )}
        </h4>
        <Switch
          checked={toggleVisibilityCourse}
          onChange={(e) => onToggleVisibility(courseId, e.target.checked)}
        />
      </div>

      <div className="flex col-span-3 justify-end space-x-2">
        <Tooltip title="Ouvrir la page du cours">
          <IconButton
            size="small"
            onClick={() => window.open(`/courses/${courseId}`, '_blank', 'noopener,noreferrer')}
          >
            <OpenInNewIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
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