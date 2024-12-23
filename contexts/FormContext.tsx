"use client";

import { createContext, useContext, ReactNode } from "react";

interface FormContextProps {
  someValue: string;
}

const defaultValue: FormContextProps = {
  someValue: "default",
};

const FormContext = createContext<FormContextProps>(defaultValue);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const value = {
    someValue: "provided value",
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};