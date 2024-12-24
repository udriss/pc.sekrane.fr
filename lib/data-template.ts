export const dataTemplate = `
export interface Activity {
  id: string;
  name: string;
  title: string;
  pdfUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
}

export const courses: Course[] = __COURSES__;
`;