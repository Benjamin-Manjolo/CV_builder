import { CVContent } from "@/types/cv";

interface CVPreviewProps {
  content: CVContent;
  themeColor: string;
  sectionOrder: string[];
}

const CVPreview = ({ content, themeColor, sectionOrder }: CVPreviewProps) => {
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "header":
        return (
          <div key="header" className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${themeColor}` }}>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "Playfair Display, serif", color: themeColor }}>
              {content.header.name || "Your Name"}
            </h1>
            <p className="text-base text-muted-foreground mb-2">{content.header.title || "Professional Title"}</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {content.header.email && <span>{content.header.email}</span>}
              {content.header.phone && <span>{content.header.phone}</span>}
              {content.header.location && <span>{content.header.location}</span>}
              {content.header.linkedin && <span>{content.header.linkedin}</span>}
            </div>
          </div>
        );
      case "summary":
        return content.summary ? (
          <div key="summary" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>
              Professional Summary
            </h2>
            <p className="text-muted-foreground">{content.summary}</p>
          </div>
        ) : null;
      case "experience":
        return content.experience.length > 0 ? (
          <div key="experience" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Experience</h2>
            <div className="space-y-4">
              {content.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-foreground">{exp.role || "Role"}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mb-1">{exp.company || "Company"}</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                    {exp.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "education":
        return content.education.length > 0 ? (
          <div key="education" className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>Education</h2>
            {content.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                </div>
                <span className="text-xs text-muted-foreground">{edu.year}</span>
              </div>
            ))}
          </div>
        ) : null;
      case "skills":
        return content.skills.filter(Boolean).length > 0 ? (
          <div key="skills">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>Skills</h2>
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
      default:
        return null;
    }
  };

  return (
    <div id="cv-preview" className="font-body text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {sectionOrder.map(renderSection)}
    </div>
  );
};

export default CVPreview;
