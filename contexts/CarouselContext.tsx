"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CarouselContextProps {
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
}

const CarouselContext = createContext<CarouselContextProps | undefined>(undefined);

interface CarouselProviderProps {
  children: ReactNode;
}

export const CarouselProvider: React.FC<CarouselProviderProps> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => prev + 1);
  const prevSlide = () => setCurrentSlide((prev) => prev - 1);

  return (
    <CarouselContext.Provider value={{ currentSlide, nextSlide, prevSlide }}>
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a CarouselProvider');
  }
  return context;
};