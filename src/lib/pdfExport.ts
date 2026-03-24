import html2pdf from "html2pdf.js";

export const exportToPDF = async (
  elementId: string,
  filename: string
) => {
  console.log('📄 exportToPDF called with', { elementId, filename });
  const element = document.getElementById(elementId);
  console.log('🔍 Element found:', element);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    throw new Error("Element not found");
  }
   console.log('⚙️ Starting html2pdf generation...');
  const opt = {
    margin: 0.5,
    filename: filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
    },
    jsPDF: {
      unit: "in" as const,
      format: "letter" as const,
      orientation: "portrait" as const, // ✅ Add 'as const'
    },
  };

  await html2pdf()
    .set(opt)
    .from(element)
    .save();
     console.log('✅ PDF saved successfully');
};