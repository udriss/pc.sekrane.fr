// components/course-content.tsx
'use client'

import { ActivityList } from "@/components/activity-list"
import type { Activity } from "@/lib/data"

interface CourseContentProps {
  title: string
  description: string
  activities: Activity[]
}

export function CourseContent({ title, description, activities }: CourseContentProps) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <div className="max-w-2xl">
        <ActivityList activities={activities} />
      </div>
    </div>
  )
}