import { pdf } from "@react-pdf/renderer";
import { ReactElement } from "react";

export const downloadPdfBlob = async (
  pdfDocument: ReactElement,
  filename: string
) => {
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);
  const link = globalThis.document.createElement("a");
  link.href = url;
  link.download = filename.replace(/\s+/g, "_") + ".pdf";
  globalThis.document.body.appendChild(link);
  link.click();
  globalThis.document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
