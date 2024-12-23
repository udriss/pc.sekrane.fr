export interface Activity {
  id: string;
  title: string;
  pdfUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
}

export const courses: Course[] = [
  {
    id: "math",
    title: "Mathématiques",
    description: "Cours de mathématiques avancées",
    activities: [
    ]
  }
];