
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
    "id": "1735056025955",
    "title": "wwww",
    "description": "w",
    "activities": []
  },
  {
    "id": "1735056375896",
    "title": "aaaaaq",
    "description": "qq",
    "activities": []
  },
  {
    "id": "1735056401749",
    "title": "qqqqwwhqfkH",
    "description": "",
    "activities": []
  }
];
