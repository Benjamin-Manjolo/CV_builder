import { LetterContent } from "@/types/letter";

interface LetterPreviewProps {
  content: LetterContent;
  themeColor: string;
  spacing?: "compact" | "comfortable" | "spacious";
  fontHeading?: string;
  fontBody?: string;
}

const SPACING_MAP = {
  compact: { section: "mb-3", text: "text-[11px] leading-relaxed" },
  comfortable: { section: "mb-5", text: "text-sm leading-relaxed" },
  spacious: { section: "mb-7", text: "text-sm leading-loose" },
};

const LetterPreview = ({
  content,
  themeColor,
  spacing = "comfortable",
  fontHeading = "Playfair Display",
  fontBody = "DM Sans",
}: LetterPreviewProps) => {
  const sp = SPACING_MAP[spacing];
  const headingFont = `${fontHeading}, serif`;
  const bodyFont = `${fontBody}, sans-serif`;

  return (
    <div id="letter-preview" style={{ fontFamily: bodyFont }}>
      {/* Sender info */}
      <div className={sp.section} style={{ borderBottom: `2px solid ${themeColor}` }}>
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: headingFont, color: themeColor }}>
          {content.sender.name || "Your Name"}
        </h1>
        <p className="text-xs text-muted-foreground mb-1" style={{ fontFamily: bodyFont }}>
          {content.sender.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground pb-3">
          {content.sender.email && <span>{content.sender.email}</span>}
          {content.sender.phone && <span>{content.sender.phone}</span>}
          {content.sender.address && <span>{content.sender.address}</span>}
        </div>
      </div>

      {/* Date */}
      <p className={`${sp.text} text-muted-foreground ${sp.section}`}>{content.date}</p>

      {/* Recipient */}
      <div className={sp.section}>
        <p className={`${sp.text} text-foreground font-semibold`}>{content.recipient.name}</p>
        <p className={`${sp.text} text-muted-foreground`}>{content.recipient.title}</p>
        <p className={`${sp.text} text-muted-foreground`}>{content.recipient.company}</p>
        <p className={`${sp.text} text-muted-foreground`}>{content.recipient.address}</p>
      </div>

      {/* Subject */}
      {content.subject && (
        <p className={`${sp.section} font-semibold text-foreground`} style={{ fontFamily: headingFont }}>
          Re: {content.subject}
        </p>
      )}

      {/* Greeting */}
      <p className={`${sp.text} text-foreground ${sp.section}`}>{content.greeting}</p>

      {/* Body */}
      <div className={sp.section}>
        {content.body.map((paragraph, i) => (
          <p key={i} className={`${sp.text} text-muted-foreground mb-3 last:mb-0`}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Closing */}
      <div className="mt-8">
        <p className={`${sp.text} text-foreground mb-6`}>{content.closing}</p>
        <p className="font-semibold text-foreground" style={{ fontFamily: headingFont, color: themeColor }}>
          {content.signature}
        </p>
      </div>
    </div>
  );
};

export default LetterPreview;
