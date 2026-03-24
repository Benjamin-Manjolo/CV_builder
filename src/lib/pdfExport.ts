import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';

// Function to export HTML content to PDF
export const exportToPDF = (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID ${elementId} not found.`);
        return;
    }

    const opt = {
        margin:       1,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to convert HTML to PDF
    // Uncomment the line below if using newer version of html2pdf
    // html2pdf().from(element).set(opt).save();
    html2pdf(element, opt);
};
