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
    "id": "1735004384895",
    "title": "azss",
    "description": "q",
    "activities": []
  },
  {
    "id": "1735004405074",
    "title": "qkslleh",
    "description": "aaaaaa",
    "activities": []
  },
  {
    "id": "1735004411313",
    "title": "asasasas",
    "description": "aaa",
    "activities": []
  },
  {
    "id": "1735004432209",
    "title": "jbqfjg",
    "description": "qq",
    "activities": []
  }
];
