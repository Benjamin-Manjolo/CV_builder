import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SectionAccordionProps {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const SectionAccordion = ({ id, title, expanded, onToggle, children }: SectionAccordionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-background border rounded-lg overflow-hidden">
      <div className="flex items-center">
        <button
          {...attributes}
          {...listeners}
          className="px-2 py-3 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          onClick={onToggle}
          className="flex-1 flex items-center justify-between pr-4 py-3 hover:bg-secondary/50 transition-colors"
        >
          <span className="font-heading font-semibold text-sm text-foreground">{title}</span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
};

export default SectionAccordion;
