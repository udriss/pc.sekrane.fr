"use client";

import { createContext, useContext, ReactNode } from "react";

interface ToggleGroupContextProps {
  someValue: string;
}

const defaultValue: ToggleGroupContextProps = {
  someValue: "default",
};

const ToggleGroupContext = createContext<ToggleGroupContextProps>(defaultValue);

export const useToggleGroupContext = () => {
  const context = useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("useToggleGroupContext must be used within a ToggleGroupProvider");
  }
  return context;
};

export const ToggleGroupProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    someValue: "provided value",
  };

  return <ToggleGroupContext.Provider value={value}>{children}</ToggleGroupContext.Provider>;
};