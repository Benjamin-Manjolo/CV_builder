import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { CVPageSize } from "@/types/cv";

export async function downloadCVAsPDF(
  elementId: string,
  filename: string,
  pageSize: CVPageSize = "letter"
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  // Page dimensions in mm
  const pageW = pageSize === "letter" ? 215.9 : 210;
  const pageH = pageSize === "letter" ? 279.4 : 297;
  const format = pageSize === "letter" ? "letter" : "a4";

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = pageW;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const pdf = new jsPDF("p", "mm", format);

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageH;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageH;
  }

  pdf.save(filename.replace(/\s+/g, "_") + ".pdf");
}
