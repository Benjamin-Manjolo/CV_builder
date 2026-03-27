import { CVContent, CVPageSize } from "@/types/cv";

export function downloadCVAsPDF(content: CVContent, themeColor: string, title: string, pageSize: CVPageSize = "letter") {
  const html = buildCVHTML(content, themeColor, title, pageSize);

  // Blob URL approach — reliable cross-browser, not blocked like iframes
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    // Popup blocked — fall back to downloading as .html file
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
        URL.revokeObjectURL(url);
      }, 2000);
    }, 600);
  };
}

function buildCVHTML(content: CVContent, themeColor: string, title: string, pageSize: CVPageSize): string {
  const { header, summary, experience, education, skills } = content;

  const experienceHTML = experience
    .filter((e) => e.company || e.role)
    .map(
      (exp) => `
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <strong style="font-size:13px;color:#1a1a1a;">${exp.role || "Role"}</strong>
          <span style="font-size:11px;color:#666;white-space:nowrap;">${exp.startDate}${exp.endDate ? " — " + exp.endDate : ""}</span>
        </div>
        <div style="font-size:11px;color:#555;margin-bottom:4px;">${exp.company || ""}</div>
        <ul style="margin:0;padding-left:16px;">
          ${exp.bullets.filter(Boolean).map((b) => `<li style="font-size:12px;color:#444;margin-bottom:2px;">${b}</li>`).join("")}
        </ul>
      </div>`
    )
    .join("");

  const educationHTML = education
    .filter((e) => e.institution || e.degree)
    .map(
      (edu) => `
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
        <div>
          <strong style="font-size:13px;color:#1a1a1a;">${edu.degree}${edu.field ? " in " + edu.field : ""}</strong>
          <div style="font-size:11px;color:#555;">${edu.institution || ""}</div>
        </div>
        <span style="font-size:11px;color:#666;">${edu.year || ""}</span>
      </div>`
    )
    .join("");

  const skillsHTML = skills
    .filter(Boolean)
    .map(
      (s) =>
        `<span style="display:inline-block;background:${themeColor}18;color:${themeColor};border-radius:20px;padding:3px 10px;font-size:11px;margin:2px 3px 2px 0;">${s}</span>`
    )
    .join("");

  const sectionHeading = (label: string) =>
    `<div style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${themeColor};border-bottom:1.5px solid ${themeColor};padding-bottom:4px;margin:20px 0 10px;">${label}</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', sans-serif;
      color: #1a1a1a;
      background: #fff;
      padding: 32px 40px;
      font-size: 13px;
      line-height: 1.55;
    }
    @page { size: ${pageSize === "letter" ? "8.5in 11in" : "210mm 297mm"}; margin: 0; }
    @media print {
      body { padding: 24px 32px; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div style="text-align:center;padding-bottom:18px;border-bottom:2px solid ${themeColor};margin-bottom:4px;">
    <h1 style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:${themeColor};margin-bottom:4px;">${header.name || "Your Name"}</h1>
    <p style="font-size:14px;color:#555;margin-bottom:8px;">${header.title || ""}</p>
    <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0 20px;font-size:11px;color:#666;">
      ${header.email ? `<span>${header.email}</span>` : ""}
      ${header.phone ? `<span>${header.phone}</span>` : ""}
      ${header.location ? `<span>${header.location}</span>` : ""}
      ${header.linkedin ? `<span>${header.linkedin}</span>` : ""}
    </div>
  </div>
  ${summary ? `${sectionHeading("Professional Summary")}<p style="font-size:12px;color:#444;line-height:1.6;">${summary}</p>` : ""}
  ${experience.length > 0 ? `${sectionHeading("Experience")}${experienceHTML}` : ""}
  ${education.length > 0 ? `${sectionHeading("Education")}${educationHTML}` : ""}
  ${skills.filter(Boolean).length > 0 ? `${sectionHeading("Skills")}<div style="margin-top:4px;">${skillsHTML}</div>` : ""}
</body>
</html>`;
}