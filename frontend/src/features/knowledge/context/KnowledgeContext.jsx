import { createContext, useContext } from "react";

const KnowledgeContext = createContext(null);

export const KnowledgeProvider = KnowledgeContext.Provider;

export function useKnowledgeContext() {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledgeContext debe usarse dentro de un KnowledgeProvider");
  }
  return context;
}