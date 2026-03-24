import { useState, useCallback, useEffect } from "react";
import { CVContent, CVDocument } from "@/types/cv";

const STORAGE_KEY = "craftcv_documents";

const loadDocs = (): CVDocument[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export function useDocuments() {
  const [documents, setDocuments] = useState<CVDocument[]>(loadDocs());

  useEffect(() => {
    const handleStorageChange = () => setDocuments(loadDocs());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveDocument = useCallback(async (doc: CVDocument): Promise<void> => {
    return new Promise((resolve) => {
      setDocuments((prev) => {
        const existing = prev.findIndex((d) => d.id === doc.id);
        const updated = existing >= 0
          ? prev.map((d) => d.id === doc.id ? doc : d)
          : [doc, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        resolve();
        return updated;
      });
    });
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const getDocument = useCallback((id: string): CVDocument | null => {
    return loadDocs().find((d) => d.id === id) ?? null;
  }, []);

  return { documents, saveDocument, deleteDocument, getDocument };
}
