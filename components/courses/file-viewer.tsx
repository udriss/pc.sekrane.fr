import React from 'react';

interface FileViewerProps {
  fileContent: string;
}

const FileViewer: React.FC<FileViewerProps> = ({ fileContent }) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { margin: 0; padding: 20px; }
        </style>
      </head>
      <body>
        ${fileContent}
      </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={htmlContent}
      style={{ width: '100%', height: '1200px', border: '1px solid #ccc' }}
      sandbox="allow-scripts"
      title="File Preview"
    />
  );
};

export default FileViewer;