import React from 'react';
import {
  Edit,
  CalendarToday,
  School,
  MenuBook,
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
  Description,
  Science,
  Engineering,
  Colorize,
  Handyman,
  ImportantDevices,
} from '@mui/icons-material';
 
const iconMap: Record<string, React.ComponentType<any>> = {
  'handyman': Handyman,
  'colorize': Colorize,
  'engineering': Engineering,
  'science': Science,
  'edit': Edit,
  'devices': ImportantDevices,
  'calendar': CalendarToday,
  'school': School,
  'book': MenuBook,
  'explore': TravelExplore,
  'lightbulb': Lightbulb,
  'notifications': Notifications,
  'star': Star,
  'favorite': Favorite,
  'pin': PushPin,
  'trophy': EmojiEvents,
  'celebration': Celebration,
  'palette': Palette,
  'music': MusicNote,
  'movie': Movie,
  'camera': PhotoCamera,
  'link': Link,
  'chart': BarChart,
  'chat': Chat,
  'pdf': PictureAsPdf,
  'video': VideoLibrary,
  'text': Description
};

interface MaterialIconProps {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialIcon({ name = 'edit', className = '', style }: MaterialIconProps) {
  if (!name || name === 'none') {
    return null;
  }
  const IconComponent = iconMap[name] || Edit;
  return <IconComponent className={className} style={style} />;
}

export { iconMap };
