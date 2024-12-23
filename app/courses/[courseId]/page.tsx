import { useEffect, useState } from "react";
import { ActivityList } from "@/components/activity-list";
import { notFound } from "next/navigation";

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      const res = await fetch(`/api/courses/${params.courseId}`);
      if (res.status === 404) {
        notFound();
      } else {
        const data = await res.json();
        setCourse(data.course);
      }
    }
    fetchCourse();
  }, [params.courseId]);

  if (!course) {
    return <div>Loading...</div>;
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