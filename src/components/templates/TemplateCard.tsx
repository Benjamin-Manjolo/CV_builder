import { Link } from "react-router-dom";
import { CVTemplate } from "@/types/cv";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  template: CVTemplate;
}

const TemplateCard = ({ template }: TemplateCardProps) => (
  <div className="group relative bg-background rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border">
    {/* Thumbnail preview */}
    <div
      className="aspect-[3/4] relative flex items-center justify-center"
      style={{ backgroundColor: template.thumbnailColor + "15" }}
    >
      {/* Mini CV preview */}
      <div className="w-[75%] h-[85%] bg-background rounded shadow-sm border p-4 flex flex-col gap-2">
        <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: template.thumbnailColor }} />
        <div className="h-1.5 rounded-full bg-muted w-3/4" />
        <div className="h-1.5 rounded-full bg-muted w-2/3" />
        <div className="mt-2 h-1 rounded-full bg-muted w-full" />
        <div className="h-1 rounded-full bg-muted w-full" />
        <div className="h-1 rounded-full bg-muted w-5/6" />
        <div className="mt-2 h-1.5 rounded-full w-1/3" style={{ backgroundColor: template.thumbnailColor + "80" }} />
        <div className="h-1 rounded-full bg-muted w-full" />
        <div className="h-1 rounded-full bg-muted w-4/5" />
        <div className="h-1 rounded-full bg-muted w-full" />
        <div className="flex-1" />
        <div className="flex gap-1.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 flex-1 rounded bg-muted" />
          ))}
        </div>
      </div>

      {/* Premium badge */}
      {template.isPremium && (
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <Lock className="h-3 w-3" />
          Premium
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-3">
          <Link to={`/editor/new?template=${template.id}`}>
            <Button variant="hero" size="sm">Use Template</Button>
          </Link>
        </div>
      </div>
    </div>

    {/* Info */}
    <div className="p-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading font-semibold text-foreground">{template.name}</h3>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {template.category}
        </span>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
      {template.isPremium && template.price && (
        <p className="text-sm font-semibold text-primary mt-2">${template.price.toFixed(2)} one-time</p>
      )}
    </div>
  </div>
);

export default TemplateCard;
