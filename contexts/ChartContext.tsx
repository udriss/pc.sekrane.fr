"use client";

import { createContext, useContext, ReactNode } from "react";

interface ChartContextProps {
  someValue: string;
}

const defaultValue: ChartContextProps = {
  someValue: "default",
};

const ChartContext = createContext<ChartContextProps>(defaultValue);

export const useChartContext = () => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider");
  }
  return context;
};

export const ChartProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    someValue: "provided value",
  };

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
};