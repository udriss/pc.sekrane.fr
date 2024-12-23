import { courses } from "@/lib/data";
import { ActivityList } from "@/components/activity-list";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return courses.map((course) => ({
    courseId: course.id,
  }));
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const course = courses.find((c) => c.id === params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-muted-foreground mb-8">{course.description}</p>
      <div className="max-w-2xl">
        <ActivityList activities={course.activities} />
      </div>
    </div>
  );
}