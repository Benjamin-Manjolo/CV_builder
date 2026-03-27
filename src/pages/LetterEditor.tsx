import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getLetterTemplate } from "@/data/letterTemplates";
import { LetterContent } from "@/types/letter";
import { CVPageSize } from "@/types/cv";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Download } from "lucide-react";
import LetterPreview from "@/components/editor/LetterPreview";
import ThemeCustomizer from "@/components/editor/ThemeCustomizer";
import { downloadCVAsPDF } from "@/components/PdfDownload";

const LetterEditorPage = () => {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template") || "formal-classic";
  const template = getLetterTemplate(templateId);
  const theme = template?.theme || getLetterTemplate("formal-classic")!.theme;

  const [content, setContent] = useState<LetterContent>(
    template?.defaultContent || getLetterTemplate("formal-classic")!.defaultContent
  );
  const [docTitle, setDocTitle] = useState("My Cover Letter");
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved">("saved");

  const [themeColor, setThemeColor] = useState(theme.primaryColor);
  const [fontHeading, setFontHeading] = useState(theme.fontHeading);
  const [fontBody, setFontBody] = useState(theme.fontBody);
  const [spacing, setSpacing] = useState(theme.spacing || "comfortable");
  const [pageSize, setPageSize] = useState<CVPageSize>("letter");

  const markUnsaved = useCallback(() => setSaveStatus("unsaved"), []);

  const updateSender = (field: keyof LetterContent["sender"], value: string) => {
    setContent((prev) => ({ ...prev, sender: { ...prev.sender, [field]: value } }));
    markUnsaved();
  };

  const updateRecipient = (field: keyof LetterContent["recipient"], value: string) => {
    setContent((prev) => ({ ...prev, recipient: { ...prev.recipient, [field]: value } }));
    markUnsaved();
  };

  const handleSave = () => setSaveStatus("saved");

  const handleDownloadPDF = async () => {
    await downloadCVAsPDF("letter-preview", docTitle, pageSize);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      {/* Toolbar */}
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

      {/* Main editor */}
      <div className="pt-[7.5rem] flex-1 flex">
        <div className="flex flex-col lg:flex-row w-full container mx-auto gap-6 p-4 pb-16">
          {/* Left: Edit panel */}
          <div className="lg:w-[420px] shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
            <ThemeCustomizer
              color={themeColor}
              fontHeading={fontHeading}
              fontBody={fontBody}
              layout="single-column"
              spacing={spacing}
              pageSize={pageSize}
              onColorChange={setThemeColor}
              onFontChange={(h, b) => { setFontHeading(h); setFontBody(b); }}
              onLayoutChange={() => {}}
              onSpacingChange={setSpacing}
              onPageSizeChange={setPageSize}
              hideLayout
            />

            {/* Sender */}
            <div className="bg-background border rounded-lg p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm text-foreground">Your Details</h3>
              <Input placeholder="Full Name" value={content.sender.name} onChange={(e) => updateSender("name", e.target.value)} />
              <Input placeholder="Professional Title" value={content.sender.title} onChange={(e) => updateSender("title", e.target.value)} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Email" value={content.sender.email} onChange={(e) => updateSender("email", e.target.value)} />
                <Input placeholder="Phone" value={content.sender.phone} onChange={(e) => updateSender("phone", e.target.value)} />
              </div>
              <Input placeholder="Address" value={content.sender.address} onChange={(e) => updateSender("address", e.target.value)} />
            </div>

            {/* Recipient */}
            <div className="bg-background border rounded-lg p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm text-foreground">Recipient</h3>
              <Input placeholder="Recipient Name" value={content.recipient.name} onChange={(e) => updateRecipient("name", e.target.value)} />
              <Input placeholder="Recipient Title" value={content.recipient.title} onChange={(e) => updateRecipient("title", e.target.value)} />
              <Input placeholder="Company" value={content.recipient.company} onChange={(e) => updateRecipient("company", e.target.value)} />
              <Input placeholder="Address" value={content.recipient.address} onChange={(e) => updateRecipient("address", e.target.value)} />
            </div>

            {/* Letter content */}
            <div className="bg-background border rounded-lg p-4 space-y-3">
              <h3 className="font-heading font-semibold text-sm text-foreground">Letter Content</h3>
              <Input placeholder="Date" value={content.date} onChange={(e) => { setContent((p) => ({ ...p, date: e.target.value })); markUnsaved(); }} />
              <Input placeholder="Subject" value={content.subject} onChange={(e) => { setContent((p) => ({ ...p, subject: e.target.value })); markUnsaved(); }} />
              <Input placeholder="Greeting (e.g. Dear...)" value={content.greeting} onChange={(e) => { setContent((p) => ({ ...p, greeting: e.target.value })); markUnsaved(); }} />
              <Textarea
                placeholder="Body paragraphs (separate with blank lines)"
                value={content.body.join("\n\n")}
                onChange={(e) => { setContent((p) => ({ ...p, body: e.target.value.split("\n\n").filter(Boolean) })); markUnsaved(); }}
                rows={10}
              />
              <Input placeholder="Closing (e.g. Sincerely,)" value={content.closing} onChange={(e) => { setContent((p) => ({ ...p, closing: e.target.value })); markUnsaved(); }} />
              <Input placeholder="Signature Name" value={content.signature} onChange={(e) => { setContent((p) => ({ ...p, signature: e.target.value })); markUnsaved(); }} />
            </div>
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
              <LetterPreview
                content={content}
                themeColor={themeColor}
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

export default LetterEditorPage;
