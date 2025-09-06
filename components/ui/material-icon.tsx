import React from 'react';
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

const iconMap: Record<string, React.ComponentType<any>> = {
  'edit': Edit,
  'calendar': CalendarToday,
  'school': School,
  'book': MenuBook,
  'create': Create,
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
  const IconComponent = iconMap[name] || Edit;
  
  return <IconComponent className={className} style={style} />;
}

export { iconMap };
