
export interface Activity {
  id: string;
  title: string;
  pdfUrl: string;
};


export interface Course {
  id: string;
  title: string;
  description: string;
  activities: { id: string; title: string; pdfUrl: string; }[];

}


export const courses = [
  {
    "id": "math",
    "title": "Mathématiques",
    "description": "Cours de mathématiques avancées",
    "activities": []
  },
  {
    "id": "1735000164714",
    "title": "az",
    "description": "",
    "activities": []
  }
];
