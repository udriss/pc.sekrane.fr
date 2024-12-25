
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
  activities: Activity[];
}

export const courses: Course[] = [
  {
    "id": "1735071485630",
    "title": "WWWW",
    "description": "aazk:FLef",
    "activities": [
      {
        "id": "1735071589085",
        "name": "TSTI_C4_TP1.ipynb",
        "title": "Notebook 1",
        "fileUrl": "/1735071485630/notebook/1735071589077-TSTI_C4_TP1.ipynb"
      },
      {
        "id": "1735071596802",
        "name": "TSTI_C4.pdf",
        "title": "Cours 1",
        "fileUrl": "/1735071485630/pdf/1735071596799-TSTI_C4.pdf"
      }
    ]
  },
  {
    "id": "1735071570172",
    "title": "ZZZZ",
    "description": "=kwldjlqrsg",
    "activities": []
  }
];
