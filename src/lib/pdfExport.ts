import { pdf } from "@react-pdf/renderer";

export const downloadPdfBlob = async (
  document: React.ReactElement,
  filename: string
) => {
  const blob = await pdf(document).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement
    ? Object.assign(globalThis.document.createElement("a"), {
        href: url,
        download: filename.replace(/\s+/g, "_") + ".pdf",
      })
    : null;

  if (link) {
    globalThis.document.body.appendChild(link);
    link.click();
    globalThis.document.body.removeChild(link);
  }
  URL.revokeObjectURL(url);
};
