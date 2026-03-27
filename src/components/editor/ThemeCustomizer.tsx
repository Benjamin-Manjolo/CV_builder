import { CVLayout, CVSpacing, CVPageSize } from "@/types/cv";
import { Label } from "@/components/ui/label";
import { Columns2, LayoutList, PanelLeft, Minus, AlignJustify, AlignCenter } from "lucide-react";

const FONT_PAIRS = [
  { label: "Classic Serif", heading: "Playfair Display", body: "DM Sans" },
  { label: "Modern Sans", heading: "DM Sans", body: "DM Sans" },
  { label: "Editorial", heading: "Georgia", body: "DM Sans" },
  { label: "Bold Impact", heading: "Playfair Display", body: "Georgia" },
];

const COLOR_PRESETS = [
  "#7c2d36", "#1e3a5f", "#374151", "#2d2926",
  "#b8860b", "#166534", "#7e22ce", "#0e7490",
];

const LAYOUTS: { id: CVLayout; label: string; icon: React.ReactNode }[] = [
  { id: "single-column", label: "Single", icon: <LayoutList className="h-4 w-4" /> },
  { id: "two-column", label: "Two Column", icon: <Columns2 className="h-4 w-4" /> },
  { id: "sidebar", label: "Sidebar", icon: <PanelLeft className="h-4 w-4" /> },
];

const SPACINGS: { id: CVSpacing; label: string; icon: React.ReactNode }[] = [
  { id: "compact", label: "Compact", icon: <Minus className="h-4 w-4" /> },
  { id: "comfortable", label: "Comfortable", icon: <AlignCenter className="h-4 w-4" /> },
  { id: "spacious", label: "Spacious", icon: <AlignJustify className="h-4 w-4" /> },
];

const PAGE_SIZES: { id: CVPageSize; label: string; desc: string }[] = [
  { id: "letter", label: "US Letter", desc: '8.5 × 11"' },
  { id: "a4", label: "A4", desc: "210 × 297mm" },
];

interface ThemeCustomizerProps {
  color: string;
  fontHeading: string;
  fontBody: string;
  layout: CVLayout;
  spacing: CVSpacing;
  pageSize: CVPageSize;
  onColorChange: (color: string) => void;
  onFontChange: (heading: string, body: string) => void;
  onLayoutChange: (layout: CVLayout) => void;
  onSpacingChange: (spacing: CVSpacing) => void;
  onPageSizeChange: (pageSize: CVPageSize) => void;
}

const ThemeCustomizer = ({
  color, fontHeading, fontBody, layout, spacing, pageSize,
  onColorChange, onFontChange, onLayoutChange, onSpacingChange, onPageSizeChange,
}: ThemeCustomizerProps) => {
  const activeFontPair = FONT_PAIRS.find(
    (f) => f.heading === fontHeading && f.body === fontBody
  );

  return (
    <div className="space-y-5 bg-card rounded-lg border p-4">
      <h3 className="font-heading font-semibold text-sm text-foreground">Theme Customization</h3>

      {/* Color */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Accent Color</Label>
        <div className="flex items-center gap-2 flex-wrap">
          {COLOR_PRESETS.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className="h-7 w-7 rounded-full border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: color === c ? c : "transparent",
                boxShadow: color === c ? `0 0 0 2px hsl(var(--background)), 0 0 0 4px ${c}` : "none",
              }}
            />
          ))}
          <label className="relative h-7 w-7 rounded-full border-2 border-dashed border-muted-foreground/30 cursor-pointer overflow-hidden hover:border-muted-foreground/60 transition-colors">
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">+</span>
          </label>
        </div>
      </div>

      {/* Fonts */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Font Pair</Label>
        <div className="grid grid-cols-2 gap-2">
          {FONT_PAIRS.map((pair) => (
            <button
              key={pair.label}
              onClick={() => onFontChange(pair.heading, pair.body)}
              className={`text-left p-2 rounded-md border text-xs transition-colors ${
                activeFontPair?.label === pair.label
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/40"
              }`}
            >
              <span className="font-semibold block" style={{ fontFamily: `${pair.heading}, serif` }}>
                {pair.label}
              </span>
              <span className="text-muted-foreground" style={{ fontFamily: `${pair.body}, sans-serif` }}>
                Body text
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Layout</Label>
        <div className="flex gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayoutChange(l.id)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border text-xs transition-colors ${
                layout === l.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground/40"
              }`}
            >
              {l.icon}
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Spacing</Label>
        <div className="flex gap-2">
          {SPACINGS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSpacingChange(s.id)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-md border text-xs transition-colors ${
                spacing === s.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground/40"
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Size */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Page Size</Label>
        <div className="flex gap-2">
          {PAGE_SIZES.map((ps) => (
            <button
              key={ps.id}
              onClick={() => onPageSizeChange(ps.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 p-2 rounded-md border text-xs transition-colors ${
                pageSize === ps.id
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground/40"
              }`}
            >
              <span className="font-medium">{ps.label}</span>
              <span className="text-[10px] text-muted-foreground">{ps.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
