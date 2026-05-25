import { createContext, useContext, useState, useCallback } from "react";

const LightboxContext = createContext(null);

/**
 * Global lightbox provider.
 * Any component can call `openLightbox(src, alt)` to show
 * a full-screen image modal with a smooth animation.
 */
export function LightboxProvider({ children }) {
  const [state, setState] = useState({ isOpen: false, src: "", alt: "" });

  const openLightbox = useCallback((src, alt = "") => {
    setState({ isOpen: true, src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <LightboxContext.Provider value={{ ...state, openLightbox, closeLightbox }}>
      {children}
    </LightboxContext.Provider>
  );
}

/**
 * Hook to access the lightbox controls from any component.
 * @returns {{ isOpen: boolean, src: string, alt: string, openLightbox: function, closeLightbox: function }}
 */
export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}
