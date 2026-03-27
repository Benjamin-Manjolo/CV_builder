import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getTemplate } from "@/data/templates";
import { CVContent, CVLayout, CVSpacing, CVPageSize } from "@/types/cv";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Download, Plus, Trash2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionAccordion from "@/components/editor/SectionAccordion";
import CVPreview from "@/components/editor/CVPreview";
import ThemeCustomizer from "@/components/editor/ThemeCustomizer";
import { downloadCVAsPDF } from "@/components/PdfDownload";

const SECTION_CONFIG = [
  { id: "header", title: "Personal Info" },
  { id: "summary", title: "Summary" },
  { id: "experience", title: "Work Experience" },
  { id: "education", title: "Education" },
  { id: "skills", title: "Skills" },
];

const EditorPage = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "executive-pro";
  const template = getTemplate(templateId);
  const theme = template?.theme || getTemplate("executive-pro")!.theme;

  const [content, setContent] = useState<CVContent>(
    template?.defaultContent || getTemplate("executive-pro")!.defaultContent
  );
  const [docTitle, setDocTitle] = useState("My CV");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");
  const [sectionOrder, setSectionOrder] = useState(SECTION_CONFIG.map((s) => s.id));
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true, summary: true, experience: true, education: false, skills: false,
  });

  // Theme state
  const [themeColor, setThemeColor] = useState(theme.primaryColor);
  const [fontHeading, setFontHeading] = useState(theme.fontHeading);
  const [fontBody, setFontBody] = useState(theme.fontBody);
  const [layout, setLayout] = useState<CVLayout>(theme.layout || "single-column");
  const [spacing, setSpacing] = useState<CVSpacing>(theme.spacing || "comfortable");
  const [pageSize, setPageSize] = useState<CVPageSize>(theme.pageSize || "letter");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
      experience: [...prev.experience, { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", bullets: [""] }],
    }));
    markUnsaved();
  };

  const removeExperience = (idx: number) => {
    setContent((prev) => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
    markUnsaved();
  };

  const addEducation = () => {
    setContent((prev) => ({
      ...prev,
      education: [...prev.education, { id: crypto.randomUUID(), institution: "", degree: "", field: "", year: "" }],
    }));
    markUnsaved();
  };

  const removeEducation = (idx: number) => {
    setContent((prev) => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
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

  const handleDownloadPDF = async () => {
    await downloadCVAsPDF("cv-preview", docTitle, pageSize);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    if (saveStatus !== "unsaved") return;
    const t = setTimeout(() => setSaveStatus("saved"), 30000);
    return () => clearTimeout(t);
  }, [saveStatus, content]);

  const orderedSections = sectionOrder.map((id) => SECTION_CONFIG.find((s) => s.id === id)!);

  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case "header":
        return (
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
        );
      case "summary":
        return (
          <Textarea
            placeholder="Professional summary..."
            value={content.summary}
            onChange={(e) => { setContent((p) => ({ ...p, summary: e.target.value })); markUnsaved(); }}
            rows={4}
          />
        );
      case "experience":
        return (
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
        );
      case "education":
        return (
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
        );
      case "skills":
        return (
          <Textarea
            placeholder="Skills (comma-separated)"
            value={content.skills.join(", ")}
            onChange={(e) => { setContent((p) => ({ ...p, skills: e.target.value.split(",").map((s) => s.trim()) })); markUnsaved(); }}
            rows={3}
          />
        );
      default:
        return null;
    }
  };

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
            <Button variant="hero" size="sm" onClick={handleDownloadPDF}>
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
            <ThemeCustomizer
              color={themeColor}
              fontHeading={fontHeading}
              fontBody={fontBody}
              layout={layout}
              spacing={spacing}
              pageSize={pageSize}
              onColorChange={setThemeColor}
              onFontChange={(h, b) => { setFontHeading(h); setFontBody(b); }}
              onLayoutChange={setLayout}
              onSpacingChange={setSpacing}
              onPageSizeChange={setPageSize}
            />

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                {orderedSections.map((section) => (
                  <SectionAccordion
                    key={section.id}
                    id={section.id}
                    title={section.title}
                    expanded={expandedSections[section.id]}
                    onToggle={() => toggleSection(section.id)}
                  >
                    {renderSectionContent(section.id)}
                  </SectionAccordion>
                ))}
              </SortableContext>
            </DndContext>
          </div>

          {/* Right: Live preview */}
          <div className="flex-1 flex justify-center">
            <div
              className="bg-background shadow-elevated rounded-lg border overflow-y-auto max-h-[calc(100vh-8rem)] mx-auto"
              style={{
                width: pageSize === "letter" ? "612px" : "595px",
                minHeight: pageSize === "letter" ? "792px" : "842px",
                padding: "48px 40px",
              }}
            >
              <CVPreview
                content={content}
                themeColor={themeColor}
                sectionOrder={sectionOrder}
                layout={layout}
                spacing={spacing}
                fontHeading={fontHeading}
                fontBody={fontBody}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
