import CoursePage from "@/components/courses/activity-display";
import { notFound } from 'next/navigation';

export const dynamic = "force-dynamic";

interface ParamsPromise { courseId: string }

async function getCourse(courseId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not defined');
    }

    const res = await fetch(`${baseUrl}/api/courses/${courseId}`, { cache: 'no-store' });

    if (!res.ok) return null;
    const data = await res.json();
    return data.course || null;
  } catch (error) {
    console.error('[PAGE] Error fetching course:', error);
    return null;
  }
}

export default async function CoursePageWrapper({ params }: { params: Promise<ParamsPromise> }) {
  const { courseId } = await params;
  const course = await getCourse(courseId);
  if (!course) {
    notFound();
  }
  return (
    <div className="flex-grow flex justify-center items-center w-full">
      <CoursePage params={Promise.resolve({ courseId })} />
    </div>
  );
}
