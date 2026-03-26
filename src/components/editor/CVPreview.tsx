import { CVContent, CVLayout, CVSpacing } from "@/types/cv";

interface CVPreviewProps {
  content: CVContent;
  themeColor: string;
  sectionOrder: string[];
  layout?: CVLayout;
  spacing?: CVSpacing;
  fontHeading?: string;
  fontBody?: string;
}

const SPACING_MAP: Record<CVSpacing, { section: string; inner: string; text: string }> = {
  compact: { section: "mb-3", inner: "space-y-2", text: "text-[11px]" },
  comfortable: { section: "mb-5", inner: "space-y-4", text: "text-sm" },
  spacious: { section: "mb-7", inner: "space-y-5", text: "text-sm" },
};

const CVPreview = ({
  content, themeColor, sectionOrder,
  layout = "single-column", spacing = "comfortable",
  fontHeading = "Playfair Display", fontBody = "DM Sans",
}: CVPreviewProps) => {
  const sp = SPACING_MAP[spacing];
  const headingFont = `${fontHeading}, serif`;
  const bodyFont = `${fontBody}, sans-serif`;

  const sectionHeading = (label: string) => (
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-2"
      style={{ color: themeColor, fontFamily: headingFont }}
    >
      {label}
    </h2>
  );

  const renderHeader = () => (
    <div key="header" className={`text-center ${sp.section} pb-4`} style={{ borderBottom: `2px solid ${themeColor}` }}>
      <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: headingFont, color: themeColor }}>
        {content.header.name || "Your Name"}
      </h1>
      <p className={`${sp.text} text-muted-foreground mb-2`} style={{ fontFamily: bodyFont }}>
        {content.header.title || "Professional Title"}
      </p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {content.header.email && <span>{content.header.email}</span>}
        {content.header.phone && <span>{content.header.phone}</span>}
        {content.header.location && <span>{content.header.location}</span>}
        {content.header.linkedin && <span>{content.header.linkedin}</span>}
      </div>
    </div>
  );

  const renderSidebarHeader = () => (
    <div key="header" className={sp.section}>
      <h1 className="text-xl font-bold mb-1" style={{ fontFamily: headingFont, color: themeColor }}>
        {content.header.name || "Your Name"}
      </h1>
      <p className={`${sp.text} text-muted-foreground`} style={{ fontFamily: bodyFont }}>
        {content.header.title || "Professional Title"}
      </p>
    </div>
  );

  const renderSidebarContact = () => (
    <div key="contact" className={sp.section}>
      {sectionHeading("Contact")}
      <div className="space-y-1 text-xs text-muted-foreground">
        {content.header.email && <p>{content.header.email}</p>}
        {content.header.phone && <p>{content.header.phone}</p>}
        {content.header.location && <p>{content.header.location}</p>}
        {content.header.linkedin && <p>{content.header.linkedin}</p>}
      </div>
    </div>
  );

  const renderSummary = () =>
    content.summary ? (
      <div key="summary" className={sp.section}>
        {sectionHeading("Professional Summary")}
        <p className={`text-muted-foreground ${sp.text}`} style={{ fontFamily: bodyFont }}>{content.summary}</p>
      </div>
    ) : null;

  const renderExperience = () =>
    content.experience.length > 0 ? (
      <div key="experience" className={sp.section}>
        {sectionHeading("Experience")}
        <div className={sp.inner}>
          {content.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-foreground" style={{ fontFamily: headingFont }}>{exp.role || "Role"}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {exp.startDate} — {exp.endDate}
                </span>
              </div>
              <p className="text-muted-foreground text-xs mb-1">{exp.company || "Company"}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                {exp.bullets.filter(Boolean).map((b, i) => <li key={i} className={sp.text}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ) : null;

  const renderEducation = () =>
    content.education.length > 0 ? (
      <div key="education" className={sp.section}>
        {sectionHeading("Education")}
        {content.education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-baseline">
            <div>
              <h3 className="font-semibold text-foreground" style={{ fontFamily: headingFont }}>
                {edu.degree} in {edu.field}
              </h3>
              <p className="text-xs text-muted-foreground">{edu.institution}</p>
            </div>
            <span className="text-xs text-muted-foreground">{edu.year}</span>
          </div>
        ))}
      </div>
    ) : null;

  const renderSkills = () =>
    content.skills.filter(Boolean).length > 0 ? (
      <div key="skills" className={sp.section}>
        {sectionHeading("Skills")}
        <div className="flex flex-wrap gap-2">
          {content.skills.filter(Boolean).map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: themeColor + "15", color: themeColor }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    ) : null;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "header": return layout === "sidebar" ? null : renderHeader();
      case "summary": return renderSummary();
      case "experience": return renderExperience();
      case "education": return renderEducation();
      case "skills": return renderSkills();
      default: return null;
    }
  };

  // Sidebar layout
  if (layout === "sidebar") {
    const mainSections = sectionOrder.filter((s) => s !== "header" && s !== "skills");
    return (
      <div id="cv-preview" className="flex gap-6" style={{ fontFamily: bodyFont }}>
        {/* Sidebar */}
        <div className="w-[35%] shrink-0 pr-4" style={{ borderRight: `2px solid ${themeColor}20` }}>
          {renderSidebarHeader()}
          {renderSidebarContact()}
          {renderSkills()}
        </div>
        {/* Main content */}
        <div className="flex-1">
          {mainSections.map(renderSection)}
        </div>
      </div>
    );
  }

  // Two-column layout
  if (layout === "two-column") {
    const withoutHeader = sectionOrder.filter((s) => s !== "header");
    const midpoint = Math.ceil(withoutHeader.length / 2);
    const leftSections = withoutHeader.slice(0, midpoint);
    const rightSections = withoutHeader.slice(midpoint);

    return (
      <div id="cv-preview" style={{ fontFamily: bodyFont }}>
        {renderHeader()}
        <div className="flex gap-6 mt-4">
          <div className="flex-1">{leftSections.map(renderSection)}</div>
          <div className="flex-1">{rightSections.map(renderSection)}</div>
        </div>
      </div>
    );
  }

  // Single-column (default)
  return (
    <div id="cv-preview" className={`${sp.text} leading-relaxed`} style={{ fontFamily: bodyFont }}>
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default CVPreview;
