"use client";

import { useState, useEffect, useRef } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { Course, Classe } from "@/lib/dataTemplate";
import Select from "@mui/material/Select";
import { MenuItem } from "@mui/material";
import Cookies from 'js-cookie';

export const dynamic = "force-dynamic";

export default function CoursesPage() {
  const [selectedClasse, setSelectedClasse] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved class from cookie
    const savedClasse = Cookies.get('selectedClasse');
    if (savedClasse) {
      setSelectedClasse(savedClasse);
    }

    fetch("/api/courses")
      .then((res) => res.json())
      .then((data: { courses: Course[], classes: Classe[] }) => {
        setCourses(data.courses);
        const visibleClasses = data.classes.filter(classe => classe.toggleVisibilityClasse !== false);
        setClasses(visibleClasses);
      });
  }, []);

  const handleClasseChange = (value: string) => {
    setSelectedClasse(value);
    Cookies.set('selectedClasse', value, { expires: 365 }); // Cookie expires in 1 year
    selectRef.current?.querySelector('input')?.blur();
  };

  const filteredCourses = selectedClasse
    ? courses.filter((course) => 
        course.classe === selectedClasse && 
        (course.toggleVisibilityCourse !== false)
      )
    : courses.filter((course) => course.toggleVisibilityCourse !== false);

  filteredCourses.sort((a, b) => a.classe.localeCompare(b.classe));

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">Cours disponibles</h1>
      <div className="mb-4 flex items-center justify-center">
      <Select
          ref={selectRef}
          value={selectedClasse}
          onChange={(e) => handleClasseChange(e.target.value as string)}
          onOpen={() => setIsSelectOpen(true)}
          onClose={() => setIsSelectOpen(false)}
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                ul: {
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                },
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'white',
                fontWeight: 'bold',
                width: '400px',
                bgcolor: 'rgba(53, 53, 53, 0.43)',
                backdropFilter: 'blur(6px)',
                minWidth: '300px',
                '& .MuiMenuItem-root': {
                  display: 'flex',
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  bgcolor: 'transparent',
                  width: 'fit-content',
                  textAlign: 'center',
                  '&.Mui-selected': {
                    width: 'fit-content',
                    borderRadius: '12px',
                    color: 'black',
                    fontWeight: 'bold',
                    backgroundColor: 'rgb(139, 167, 201) !important'
                  },
                  '&:hover': {
                    borderRadius: '12px',
                    backgroundColor: 'rgb(0, 0, 0)'
                  }
                }
              }
            }
          }}
          sx={{
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderRadius: '12px',
              borderColor: isSelectOpen ? 'orange' : (selectedClasse ? 'green' : 'inherit'),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isSelectOpen ? 'orange' : (selectedClasse ? 'green' : 'inherit'),
            },
            '.MuiOutlinedInput-notchedOutline': {
              borderRadius: '12px',
              borderColor: isSelectOpen ? 'orange' : (selectedClasse ? 'green' : 'inherit')
            }
          }}
        >
          <MenuItem sx={{ display: 'flex', justifyContent: 'center' }}
            value="" 
          >
            <span className="text-blue-800/40">Sélectionner une classe</span>
          </MenuItem>
          {classes.map((classe) => (
            <MenuItem key={classe.id} value={classe.name}>
              {classe.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}