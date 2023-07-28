'use client'
import React from "react";

export const MobileContext = React.createContext<boolean>(null);

export const MobileProvider = ({ children }) => {
    const [mobile, setMobile] = React.useState(true);
  
    React.useEffect(() => {
      setMobile(window.innerHeight > window.innerWidth);
    }, []);
  
    return (
      <MobileContext.Provider value={mobile}>
          {children}
      </MobileContext.Provider>
    );
  };