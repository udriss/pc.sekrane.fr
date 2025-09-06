import React, { useState } from 'react';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
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

  const getIconComponent = (iconName: string) => {
    const iconData = icons.find(i => i.name === iconName);
    if (!iconData) {
      return Edit; // Default icon
    }
    return iconData.icon;
  };

  const CurrentIcon = getIconComponent(value || 'edit');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CurrentIcon className="mr-2 h-5 w-5" />
          <span>Choisir une icône</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 z-[60]">
        <div className="grid grid-cols-5 gap-2">
          {icons.map((iconData) => {
            const IconComponent = iconData.icon;
            return (
              <Button
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
      </PopoverContent>
    </Popover>
  );
}
