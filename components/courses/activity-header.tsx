import React from 'react';

interface ActivityHeaderProps {
  title: string;
  description: string;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
    </div>
  );
};

export default ActivityHeader;