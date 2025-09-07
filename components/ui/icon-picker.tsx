"use client";

import React, { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import {
  Edit,
  CalendarToday,
  School,
  MenuBook,
  Create,
  TravelExplore,
  Lightbulb,
  Notifications,
  Star,
  Favorite,
  PushPin,
  EmojiEvents,
  Celebration,
  Palette,
  MusicNote,
  Movie,
  PhotoCamera,
  Link,
  BarChart,
  Chat,
  PictureAsPdf,
  VideoLibrary,
  Description
} from '@mui/icons-material';

const icons = [
  { icon: Edit, name: 'edit' },
  { icon: CalendarToday, name: 'calendar' },
  { icon: School, name: 'school' },
  { icon: MenuBook, name: 'book' },
  { icon: Create, name: 'create' },
  { icon: TravelExplore, name: 'explore' },
  { icon: Lightbulb, name: 'lightbulb' },
  { icon: Notifications, name: 'notifications' },
  { icon: Star, name: 'star' },
  { icon: Favorite, name: 'favorite' },
  { icon: PushPin, name: 'pin' },
  { icon: EmojiEvents, name: 'trophy' },
  { icon: Celebration, name: 'celebration' },
  { icon: Palette, name: 'palette' },
  { icon: MusicNote, name: 'music' },
  { icon: Movie, name: 'movie' },
  { icon: PhotoCamera, name: 'camera' },
  { icon: Link, name: 'link' },
  { icon: BarChart, name: 'chart' },
  { icon: Chat, name: 'chat' },
  { icon: PictureAsPdf, name: 'pdf' },
  { icon: VideoLibrary, name: 'video' },
  { icon: Description, name: 'text' }
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  // Ensure the popover content is portaled inside the Dialog content when used within a Dialog
  const [container, setContainer] = useState<HTMLElement | null>(null);
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const el = document.querySelector('[data-radix-dialog-content]') as HTMLElement | null;
      setContainer(el || document.body);
    }
  }, []);

  const getIconComponent = (iconName: string) => {
    const iconData = icons.find(i => i.name === iconName);
    if (!iconData) {
      return Edit; // Default icon
    }
    return iconData.icon;
  };

  const CurrentIcon = getIconComponent(value || 'edit');

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <PopoverPrimitive.Trigger asChild>
        <Button type="button" variant="outline" className="w-full justify-start">
          <CurrentIcon className="mr-2 h-5 w-5" />
          <span>Choisir une icône</span>
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal container={container ?? undefined}>
        <PopoverPrimitive.Content 
          className="w-64 z-[9999] bg-white border border-gray-200 rounded-md shadow-lg p-2"
          sideOffset={5}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-5 gap-2">
            {icons.map((iconData) => {
              const IconComponent = iconData.icon;
              return (
                <Button
                  type="button"
                  key={iconData.name}
                  variant={value === iconData.name ? 'default' : 'outline'}
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    onChange(iconData.name);
                    setOpen(false);
                  }}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
