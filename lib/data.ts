
  export interface Activity {
    id: string;
    name: string;
    title: string;
    fileUrl: string;
  }

  export interface Course {
    id: string;
    title: string;
    description: string;
    classe: string;
    activities: Activity[];
  }

  export interface Classe {
    id: string;
    name: string;
  }

  export const classes: Classe[] = [
  {
    "id": "2",
    "name": "Classe B"
  },
  {
    "id": "3",
    "name": "Classe C"
  },
  {
    "id": "0",
    "name": "Autre"
  },
  {
    "id": "4",
    "name": "Tle STI2D"
  }
];

  export const courses: Course[] = [
  {
    "id": "1735342614051",
    "title": "TP1 ",
    "description": "",
    "classe": "Tle STI2D",
    "activities": [
      {
        "id": "1735342641130",
        "name": "Untitled.ipynb",
        "title": "Notebook 1",
        "fileUrl": "/1735342614051/notebook/Untitled.ipynb"
      },
      {
        "id": "1735342654063",
        "name": "plot.png",
        "title": "Sujet 1",
        "fileUrl": "/1735342614051/autre/plot.png"
      }
    ]
  },
  {
    "id": "1735598515414",
    "title": "TP2",
    "description": "Montée en vitesse",
    "classe": "Tle STI2D",
    "activities": [
      {
        "id": "1735603512428",
        "name": "10.jpg",
        "title": "mmm",
        "fileUrl": "/1735598515414/autre/10.jpg"
      }
    ]
  }
];
