export interface FileTypeOption {
  label: string;
  value: string;
}

export interface FileTypeGroup {
  name: string;
  options: FileTypeOption[];
}

export const FILE_TYPE_GROUPS: FileTypeGroup[] = [
  {
    name: 'Documents',
    options: [
      { label: 'PDF', value: '.pdf' },
      { label: 'Word (.doc)', value: '.doc' },
      { label: 'Word (.docx)', value: '.docx' },
      { label: 'Excel (.xlsx)', value: '.xlsx' },
      { label: 'OpenDocument', value: '.odt' },
      { label: 'OpenDocument Spreadsheet (.ods)', value: '.ods' },
      { label: 'LaTeX (.tex)', value: '.tex' },
      { label: 'Texte (.txt)', value: '.txt' }
    ]
  },
  {
    name: 'Images',
    options: [
      { label: 'JPEG', value: '.jpg' },
      { label: 'JPEG (alt)', value: '.jpeg' },
      { label: 'PNG', value: '.png' },
      { label: 'GIF', value: '.gif' },
      { label: 'SVG', value: '.svg' }
    ]
  },
  {
    name: 'Archives',
    options: [
      { label: 'ZIP', value: '.zip' }
    ]
  },
  {
    name: 'Vidéos',
    options: [
      { label: 'MP4', value: '.mp4' },
      { label: 'MOV', value: '.mov' },
      { label: 'AVI', value: '.avi' }
    ]
  },
  {
    name: 'Audio',
    options: [
      { label: 'MP3', value: '.mp3' }
    ]
  }
];

export const FILE_TYPE_OPTIONS: FileTypeOption[] = FILE_TYPE_GROUPS.flatMap(group => group.options);
