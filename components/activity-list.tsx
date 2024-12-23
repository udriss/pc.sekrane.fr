"use client";

import type { Activity } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const handleActivityClick = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className="grid gap-4">
      {activities.map((activity) => (
        <Button
          key={activity.id}
          variant="outline"
          className="w-full justify-start"
          onClick={() => handleActivityClick(activity.pdfUrl)}
        >
          <FileText className="mr-2 h-4 w-4" />
          {activity.title}
        </Button>
      ))}
    </div>
  );
}