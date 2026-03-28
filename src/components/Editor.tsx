import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getTemplate } from "@/data/templates";
import { CVContent } from "@/types/cv";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Download, Plus, Trash2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useDocuments } from "@/hooks/useDocuments";
import { downloadPdfBlob } from "@/lib/pdfExport";
import CVPdfDocument from "@/components/pdf/CVPdfDocument";
import { useAuth } from "@/components/Auth/AuthContext";
import { AuthModal } from "@/components/Auth/AuthModal";
import { toast } from "sonner";

const generateId = () => crypto.randomUUID();

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "executive-pro";
  const template = getTemplate(templateId);
  const fallback = getTemplate("executive-pro");
  
  if (!template && !fallback) {
    throw new Error("No template found");
  }
  
  const { user } = useAuth();
  const { getDocument } = useDocuments();
  const [authOpen, setAuthOpen] = useState(false);
  
  const docId = searchParams.get("doc") || generateId();
  const existingDoc = docId !== generateId() ? getDocument(docId) : null;
  
  const [content, setContent] = useState<CVContent>(
    existingDoc?.content || template?.defaultContent || fallback!.defaultContent
  );
  const [docTitle, setDocTitle] = useState(existingDoc?.title || "My CV");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    summary: true,
    experience: true,
    education: false,
    skills: false,
  });
  
  const toggleSection = (s: string) => setExpandedSections((prev) => ({ ...prev, [s]: !prev[s] }));
  
  const markUnsaved = useCallback(() => {
    if (saveStatus !== "saving") setSaveStatus("unsaved");
  }, [saveStatus]);
  
  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaveStatus("saved");
  }, []);
  
  // Auto-save simulation
  useEffect(() => {
    if (saveStatus !== "unsaved") return;
    const t = setTimeout(() => handleSave(), 2000);
    return () => clearTimeout(t);
  }, [saveStatus, content, handleSave]);
  
 const handleDownloadPDF = async () => {
  setDownloadingPDF(true);
  try {
    const pdfDoc = <CVPdfDocument content={content} themeColor={themeColor} sectionOrder={["header", "summary", "experience", "education", "skills"]} />;
    await downloadPdfBlob(pdfDoc, docTitle);
    toast.success("PDF ready", {
      description: "Downloaded successfully",
    });
  } catch (e) {
    console.error("PDF export failed:", e);
    toast.error("Export failed", {
      description: "Please try again.",
    });
  } finally {
    setDownloadingPDF(false);
  }
};
  
  const updateHeader = (field: keyof CVContent["header"], value: string) => {
    setContent((prev) => ({
      ...prev,
      header: { ...prev.header, [field]: value },
    }));
    markUnsaved();
  };
  
  const updateExperience = (idx: number, field: string, value: string | string[]) => {
    setContent((prev) => {
      const exp = [...prev.experience];
      if (!exp[idx]) return prev;
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
        {
          id: generateId(),
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          bullets: [""],
        },
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
        {
          id: generateId(),
          institution: "",
          degree: "",
          field: "",
          year: "",
        },
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
      if (!edu[idx]) return prev;
      edu[idx] = { ...edu[idx], [field]: value };
      return { ...prev, education: edu };
    });
    markUnsaved();
  };
  
  const updateSkills = (value: string) => {
    setContent((prev) => ({
      ...prev,
      skills: value.split(",").map((s) => s.trim()),
    }));
    markUnsaved();
  };
  
  const themeColor = template?.theme.primaryColor || "#7c2d36";
  
  const saveLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "unsaved"
      ? "● Unsaved"
      : "✓ Saved";
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Toolbar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b px-4 py-2">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Input
            value={docTitle}
            onChange={(e) => {
              setDocTitle(e.target.value);
              markUnsaved();
            }}
            className="max-w-xs font-heading font-semibold border-none shadow-none text-lg bg-transparent focus-visible:ring-0 p-0"
          />
          
          <div className="flex items-center gap-3">
            <span className={`text-xs ${
              saveStatus === "unsaved" ? "text-amber-500" : "text-muted-foreground"
            }`}>
              {saveLabel}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={saveStatus === "saving"}
            >
              {saveStatus === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>
            
            <Button
              variant="hero"
              size="sm"
                onClick={() => {
                console.log('🔘 Download button clicked');
                handleDownloadPDF();
  }}
              disabled={downloadingPDF}
            >
              {downloadingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Preparing…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-1" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main */}
      <div className="pt-[7.5rem] flex-1 flex">
        <div className="flex flex-col lg:flex-row w-full container mx-auto gap-6 p-4 pb-16">
          {/* LEFT PANEL */}
          <div className="lg:w-[420px] shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {/* Header Section */}
            <SectionAccordion
              title="Personal Info"
              expanded={expandedSections.header}
              onToggle={() => toggleSection("header")}
            >
              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  value={content.header.name}
                  onChange={(e) => updateHeader("name", e.target.value)}
                />
                <Input
                  placeholder="Professional Title"
                  value={content.header.title}
                  onChange={(e) => updateHeader("title", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Email"
                    value={content.header.email}
                    onChange={(e) => updateHeader("email", e.target.value)}
                  />
                  <Input
                    placeholder="Phone"
                    value={content.header.phone}
                    onChange={(e) => updateHeader("phone", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Location"
                    value={content.header.location}
                    onChange={(e) => updateHeader("location", e.target.value)}
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={content.header.linkedin || ""}
                    onChange={(e) => updateHeader("linkedin", e.target.value)}
                  />
                </div>
              </div>
            </SectionAccordion>
            
            {/* Summary */}
            <SectionAccordion
              title="Summary"
              expanded={expandedSections.summary}
              onToggle={() => toggleSection("summary")}
            >
              <Textarea
                placeholder="Professional summary..."
                value={content.summary}
                onChange={(e) => {
                  setContent((p) => ({ ...p, summary: e.target.value }));
                  markUnsaved();
                }}
                rows={4}
              />
            </SectionAccordion>
            
            {/* Experience */}
            <SectionAccordion
              title="Work Experience"
              expanded={expandedSections.experience}
              onToggle={() => toggleSection("experience")}
            >
              <div className="space-y-4">
                {content.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button
                      onClick={() => removeExperience(idx)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => updateExperience(idx, "company", e.target.value)}
                    />
                    <Input
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => updateExperience(idx, "role", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(idx, "startDate", e.target.value)}
                      />
                      <Input
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(idx, "endDate", e.target.value)}
                      />
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
            <SectionAccordion
              title="Education"
              expanded={expandedSections.education}
              onToggle={() => toggleSection("education")}
            >
              <div className="space-y-4">
                {content.education.map((edu, idx) => (
                  <div key={edu.id} className="bg-secondary/50 rounded-lg p-3 space-y-2 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, "degree", e.target.value)}
                      />
                      <Input
                        placeholder="Field"
                        value={edu.field}
                        onChange={(e) => updateEducation(idx, "field", e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Year"
                      value={edu.year}
                      onChange={(e) => updateEducation(idx, "year", e.target.value)}
                    />
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addEducation} className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Add Education
                </Button>
              </div>
            </SectionAccordion>
            
            {/* Skills */}
            <SectionAccordion
              title="Skills"
              expanded={expandedSections.skills}
              onToggle={() => toggleSection("skills")}
            >
              <Textarea
                placeholder="Skills (comma-separated)"
                value={content.skills.join(", ")}
                onChange={(e) => updateSkills(e.target.value)}
                rows={3}
              />
            </SectionAccordion>
          </div>
          
          {/* RIGHT PREVIEW */}
          <div className="flex-1 flex justify-center">
            <div
              id="cv-preview"
              className="w-full max-w-[600px] bg-background shadow-elevated rounded-lg border p-8 overflow-y-auto max-h-[calc(100vh-8rem)]"
            >
              <CVPreview content={content} themeColor={themeColor} />
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultTab="signup"
      />
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
      <span className="font-heading font-semibold text-sm">{title}</span>
      {expanded ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
    {expanded && <div className="px-4 pb-4">{children}</div>}
  </div>
);

const CVPreview = ({
  content,
  themeColor,
}: {
  content: CVContent;
  themeColor: string;
}) => (
  <div className="text-sm">
    <h1 style={{ color: themeColor }}>{content.header.name || "Your Name"}</h1>
    {/* Add more preview content here */}
  </div>
);

export default EditorPage;