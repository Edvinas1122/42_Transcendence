import React, { useState, createContext } from "react";

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [displays, setDisplays] = useState(false);

  return (
    <SidebarContext.Provider value={{ displays, setDisplays }}>
      
      {children}
    </SidebarContext.Provider>
  );
}