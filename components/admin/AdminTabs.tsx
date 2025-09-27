import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { ConnectionsList } from './ConnectionsList';
import { UploadForm } from './upload-form';
import { Classe, Course } from '@/lib/data';



export const AdminTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getcourses');
        const data = await response.json();
        setClasses(data.classes);
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.875rem',
            minHeight: 48,
            paddingX: 1,
            paddingY: 3,
          },
        }}
      >
        <Tab label="Gestion" />
        <Tab label="Connexions" />
      </Tabs>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <UploadForm courses={courses} setCourses={setCourses} classes={classes} setClasses={setClasses} />}
        {activeTab === 1 && <ConnectionsList />}
      </Box>
    </Box>
  );
};

