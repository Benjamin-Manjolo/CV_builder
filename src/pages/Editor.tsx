import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTemplate } from "@/data/templates";
import { CVContent } from "@/types/cv";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Download, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "executive-pro";
  const template = getTemplate(templateId);

  const [content, setContent] = useState<CVContent>(
    template?.defaultContent || getTemplate("executive-pro")!.defaultContent
  );
  const [docTitle, setDocTitle] = useState("My CV");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
  });

  const toggleSection = (s: string) =>
    setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const markUnsaved = useCallback(() => setSaveStatus("unsaved"), []);

  const updateHeader = (field: keyof CVContent["header"], value: string) => {
    setContent((prev) => ({ ...prev, header: { ...prev.header, [field]: value } }));
    markUnsaved();
  };

  const updateExperience = (idx: number, field: string, value: string | string[]) => {
    setContent((prev) => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: value };
      return { ...prev, experience: exp };
    });
    markUnsaved();
  };

  const addExperience = () => {
    setContent((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", bullets: [""] },
      ],
    }));
    markUnsaved();
  };

  const removeExperience = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx),
    }));
    markUnsaved();
  };

  const addEducation = () => {
    setContent((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: crypto.randomUUID(), institution: "", degree: "", field: "", year: "" },
      ],
    }));
    markUnsaved();
  };

  const removeEducation = (idx: number) => {
    setContent((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx),
    }));
    markUnsaved();
  };

  const updateEducation = (idx: number, field: string, value: string) => {
    setContent((prev) => {
      const edu = [...prev.education];
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...prev, education: edu };
    });
    markUnsaved();
  };

  const handleSave = () => setSaveStatus("saved");

  // Auto-save simulation
  useEffect(() => {
    if (saveStatus !== "unsaved") return;
    const t = setTimeout(() => setSaveStatus("saved"), 30000);
    return () => clearTimeout(t);
  }, [saveStatus, content]);

  const themeColor = template?.theme.primaryColor || "#7c2d36";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Editor toolbar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-2">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Input
            value={docTitle}
            onChange={(e) => { setDocTitle(e.target.value); markUnsaved(); }}
            className="max-w-xs font-heading font-semibold border-none shadow-none text-lg bg-transparent focus-visible:ring-0 p-0"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {saveStatus === "saved" ? "✓ Saved" : "● Unsaved changes"}
            </span>
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button variant="hero" size="sm">
              <Download className="h-4 w-4 mr-1" /> Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Main editor area */}
      <div className="pt-[7.5rem] flex-1 flex">
        <div className="flex flex-col lg:flex-row w-full container mx-auto gap-6 p-4 pb-16">
          {/* Left: Edit panel */}
          <div className="lg:w-[420px] shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {/* Header Section */}
            <SectionAccordion title="Personal Info" expanded={expandedSections.header} onToggle={() => toggleSection("header")}>
              <div className="space-y-3">
                <Input placeholder="Full Name" value={content.header.name} onChange={(e) => updateHeader("name", e.target.value)} />
                <Input placeholder="Professional Title" value={content.header.title} onChange={(e) => updateHeader("title", e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Email" value={content.header.email} onChange={(e) => updateHeader("email", e.target.value)} />
                  <Input placeholder="Phone" value={content.header.phone} onChange={(e) => updateHeader("phone", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Location" value={content.header.location} onChange={(e) => updateHeader("location", e.target.value)} />
                  <Input placeholder="LinkedIn" value={content.header.linkedin || ""} onChange={(e) => updateHeader("linkedin", e.target.value)} />
                </div>
              </div>
            </SectionAccordion>

            {/* Summary */}
            <SectionAccordion title="Summary" expanded={expandedSections.summary} onToggle={() => toggleSection("summary")}>
              <Textarea
                placeholder="Professional summary..."
                value={content.summary}
                onChange={(e) => { setContent((p) => ({ ...p, summary: e.target.value })); markUnsaved(); }}
                rows={4}
              />
            </SectionAccordion>

            {/* Experience */}
            <SectionAccordion title="Work Experience" expanded={expandedSections.experience} onToggle={() => toggleSection("experience")}>
              <div className="space-y-4">
                {content.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Input placeholder="Company" value={exp.company} onChange={(e) => updateExperience(idx, "company", e.target.value)} />
                    <Input placeholder="Role" value={exp.role} onChange={(e) => updateExperience(idx, "role", e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Start Date" value={exp.startDate} onChange={(e) => updateExperience(idx, "startDate", e.target.value)} />
                      <Input placeholder="End Date" value={exp.endDate} onChange={(e) => updateExperience(idx, "endDate", e.target.value)} />
                    </div>
                    <Textarea
                      placeholder="Achievements (one per line)"
                      value={exp.bullets.join("\n")}
                      onChange={(e) => updateExperience(idx, "bullets", e.target.value.split("\n"))}
                      rows={3}
                    />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addExperience} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Experience
                </Button>
              </div>
            </SectionAccordion>

            {/* Education */}
            <SectionAccordion title="Education" expanded={expandedSections.education} onToggle={() => toggleSection("education")}>
              <div className="space-y-4">
                {content.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, "institution", e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(idx, "degree", e.target.value)} />
                      <Input placeholder="Field" value={edu.field} onChange={(e) => updateEducation(idx, "field", e.target.value)} />
                    </div>
                    <Input placeholder="Year" value={edu.year} onChange={(e) => updateEducation(idx, "year", e.target.value)} />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Education
                </Button>
              </div>
            </SectionAccordion>

            {/* Skills */}
            <SectionAccordion title="Skills" expanded={expandedSections.skills} onToggle={() => toggleSection("skills")}>
              <Textarea
                placeholder="Skills (comma-separated)"
                value={content.skills.join(", ")}
                onChange={(e) => { setContent((p) => ({ ...p, skills: e.target.value.split(",").map((s) => s.trim()) })); markUnsaved(); }}
                rows={3}
              />
            </SectionAccordion>
          </div>

          {/* Right: Live preview */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[600px] bg-background shadow-elevated rounded-lg border p-8 overflow-y-auto max-h-[calc(100vh-8rem)]">
              <CVPreview content={content} themeColor={themeColor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionAccordion = ({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="bg-background border rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
    >
      <span className="font-heading font-semibold text-sm text-foreground">{title}</span>
      {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
    </button>
    {expanded && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const CVPreview = ({ content, themeColor }: { content: CVContent; themeColor: string }) => (
  <div className="font-body text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
    {/* Header */}
    <div className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${themeColor}` }}>
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

    {/* Summary */}
    {content.summary && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>
          Professional Summary
        </h2>
        <p className="text-muted-foreground">{content.summary}</p>
      </div>
    )}

    {/* Experience */}
    {content.experience.length > 0 && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>
          Experience
        </h2>
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
                {exp.bullets.filter(Boolean).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Education */}
    {content.education.length > 0 && (
      <div className="mb-5">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: themeColor }}>
          Education
        </h2>
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
    )}

    {/* Skills */}
    {content.skills.filter(Boolean).length > 0 && (
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: themeColor }}>
          Skills
        </h2>
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
    )}
  </div>
);

export default EditorPage;
