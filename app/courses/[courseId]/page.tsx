import CoursePage from "@/components/courses/display-activity";

export const dynamic = "force-dynamic";

export default function CoursePageWrapper({ params }: { params: Promise<{ courseId: string }> }) {
  
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex-grow flex justify-center items-center w-full">
          <div className="min-w-[1200px]">
          <CoursePage params={params} />
          </div>
        </div>
      </div>
    );
}
