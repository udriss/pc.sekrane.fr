import CoursePage from "@/components/courses/activity-display";

export const dynamic = "force-dynamic";

export default function CoursePageWrapper({ params }: { params: Promise<{ courseId: string }> }) {
  
    return (
      <div className="container flex-grow flex justify-center items-center w-full">
        <CoursePage params={params} />
      </div>
    );
}
