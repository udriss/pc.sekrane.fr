"use client";

import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <GraduationCap className="w-16 h-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold tracking-tight">Plan de travail et activités</h1>
        <p className="text-xl text-muted-foreground">
          Site web de M. Sekrane
        </p>
        <Link href="/courses">
          <Button size="lg" className="mt-6">
            Voir les cours
          </Button>
        </Link>
      </div>
{/*       <div className="mt-8 w-full max-w-4xl">
        <Carousel>
          <CarouselPrevious />
          <CarouselContent>
            <CarouselItem>
              <div className="embla__slide">Slide 1</div>
            </CarouselItem>
            <CarouselItem>
              <div className="embla__slide">Slide 2</div>
            </CarouselItem>
            <CarouselItem>
              <div className="embla__slide">Slide 3</div>
              </CarouselItem>
            </CarouselContent>
          <CarouselNext />
        </Carousel>
      </div> */}
    </div>
  );
}