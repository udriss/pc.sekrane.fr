"use client";

import { createContext, useContext, ReactNode } from "react";

interface CarouselContextProps {
  someValue: string;
}

const defaultValue: CarouselContextProps = {
  someValue: "default",
};

const CarouselContext = createContext<CarouselContextProps>(defaultValue);

export const useCarouselContext = () => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarouselContext must be used within a CarouselProvider");
  }
  return context;
};

export const CarouselProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    someValue: "provided value",
  };

  return <CarouselContext.Provider value={value}>{children}</CarouselContext.Provider>;
};