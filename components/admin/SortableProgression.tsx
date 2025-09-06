import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { MaterialIcon } from '@/components/ui/material-icon';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
 
interface SortableProgressionProps {
  progression: {
    id: string;
    date: string;
    title: string;
    content: string;
    icon?: string;
    iconColor?: string;
    contentType: string;
    resourceUrl?: string;
  };
  onEdit: (progression: any) => void;
  onDelete: (progressionId: string) => void;
}

export function SortableProgression({ progression, onEdit, onDelete }: SortableProgressionProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: progression.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-white rounded-md border">
      <div {...attributes} {...listeners} className="cursor-move select-none mr-3">
        <DragIndicatorIcon fontSize="medium" />
      </div>

      <div className="flex-1 flex items-center space-x-3">
        <MaterialIcon 
          name={progression.icon || 'edit'} 
          className="w-5 h-5"
          style={{ color: progression.iconColor || '#000' }}
        />
        <div className="flex-1">
          <div className="font-medium">{progression.title}</div>
          <div className="text-sm text-gray-500">
            {format(new Date(progression.date), 'dd MMMM yyyy', { locale: fr })}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(progression)}
        >
          <EditIcon fontSize="small" />
        </Button>

        {confirmDelete ? (
          <>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onDelete(progression.id);
                setConfirmDelete(false);
              }}
            >
              <CheckIcon fontSize="small" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="hover:bg-green-200"
              onClick={() => setConfirmDelete(false)}
            >
              <CloseIcon fontSize="small" />
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
