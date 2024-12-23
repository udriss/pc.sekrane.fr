import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { courses } from "@/lib/data";
import { GraduationCap } from "lucide-react";

interface CourseCardProps {
  course: typeof courses[0];
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <GraduationCap className="w-6 h-6" />
          <CardTitle>{course.title}</CardTitle>
        </div>
        <CardDescription>{course.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={`/courses/${course.id}`}>
          <Button className="w-full">
            Voir les activités
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}