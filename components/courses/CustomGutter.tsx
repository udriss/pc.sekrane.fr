import React from 'react';

interface CustomGutterProps {
  direction: 'horizontal' | 'vertical';
  isDragging: boolean;
}

const CustomGutter: React.FC<CustomGutterProps> = ({ direction, isDragging }) => {
  const style = {
    backgroundColor: isDragging ? '#007bff' : '#ccc',
    cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
    width: direction === 'horizontal' ? '10px' : '100%',
    height: direction === 'horizontal' ? '100%' : '10px',
  };

  return <div style={style} />;
};

export default CustomGutter;