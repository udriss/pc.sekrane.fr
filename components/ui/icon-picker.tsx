"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Button } from './button';
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
  { icon: Description, name: 'text' },
  { icon: null, name: 'none' }
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLSpanElement | null>(null);

  // When opening, resolve the nearest dialog content as the portal container
  useEffect(() => {
    if (open) {
      setContainer(document.body);
    }
  }, [open]);

  const getIconComponent = (iconName: string) => {
    const iconData = icons.find(i => i.name === iconName);
    if (!iconData || !iconData.icon) {
      return null; // No icon
    }
    return iconData.icon;
  };

  const CurrentIcon = getIconComponent(value && value !== 'none' ? value : '');

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={false}>
      <PopoverPrimitive.Trigger asChild>
        <span ref={triggerRef} className="inline-block w-full">
          <Button type="button" variant="outline" className="w-full justify-start">
            {CurrentIcon ? <CurrentIcon className="mr-2 h-5 w-5" /> : <div className="w-5 h-5 mr-2"></div>}
            <span>Choisir une icône</span>
          </Button>
        </span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal container={container ?? (typeof document !== 'undefined' ? document.body : undefined)}>
        <PopoverPrimitive.Content
          className="w-64 z-[99999] bg-white border border-gray-200 rounded-md shadow-lg p-2 pointer-events-auto"
          sideOffset={5}
          avoidCollisions={true}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="grid grid-cols-5 gap-2">
            {icons.map((iconData: { icon: React.ComponentType<any> | null; name: string }) => {
              const IconComponent: React.ComponentType<any> | null = iconData.icon;
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
                {IconComponent ? <IconComponent className="h-4 w-4" /> : <div className="w-4 h-4"></div>}
              </Button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
