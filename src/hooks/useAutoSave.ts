import { useCallback, useEffect, useRef } from "react";
import { useDocuments } from "./useDocuments";
import { CVDocument } from "@/types/cv";

export function useAutoSave(
  docId: string,
  title: string,
  templateId: string,
  content: any,
  enabled: boolean
) {
  const { saveDocument } = useDocuments();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const saveRef = useRef<(docId: string, title: string, templateId: string, content: any) => Promise<void>>();
  
  saveRef.current = useCallback(async (id: string, t: string, tid: string, c: any) => {
    const doc: CVDocument = {
      id,
      templateId: tid,
      title: t,
      content: c,
      lastSavedAt: new Date().toISOString(),
    };
    await saveDocument(doc);
  }, [saveDocument]);
  
  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      return;
    }
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new debounced save
    timeoutRef.current = setTimeout(async () => {
      if (saveRef.current) {
        await saveRef.current(docId, title, templateId, content);
      }
    }, 1500); // 1.5s debounce
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [docId, title, templateId, content, enabled]);
  
  // ✅ ADD THIS RETURN STATEMENT
  const manualSave = useCallback(async () => {
    if (saveRef.current) {
      await saveRef.current(docId, title, templateId, content);
    }
  }, [docId, title, templateId, content]);
  
  return { save: manualSave };
}