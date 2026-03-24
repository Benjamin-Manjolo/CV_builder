import { useState } from "react";
import { Link } from "react-router-dom";
import { CVTemplate } from "@/types/cv";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/Auth/AuthContext";
import { AuthModal } from "@/components/Auth/AuthModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TemplateCardProps {
  template: CVTemplate;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // A template is accessible if it's free OR the user has a pro plan
  const canAccess = !template.isPremium || user?.plan === "pro";

  const handleUseTemplate = () => {
    if (!user) {
      // Not logged in at all — show auth modal (sign up)
      setAuthOpen(true);
      return;
    }
    if (!canAccess) {
      // Logged in but free plan — show upgrade prompt
      setUpgradeOpen(true);
      return;
    }
    // Accessible — navigation handled by Link below
  };

  return (
    <>
      <div className="group relative bg-background rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border">
        {/* Thumbnail */}
        <div
          className="aspect-[3/4] relative flex items-center justify-center"
          style={{ backgroundColor: template.thumbnailColor + "15" }}
        >
          {/* Mini CV preview */}
          <div className={`w-[75%] h-[85%] bg-background rounded shadow-sm border p-4 flex flex-col gap-2 ${!canAccess ? "opacity-60" : ""}`}>
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
              {[...Array(4)].map((_, i) => <div key={i} className="h-4 flex-1 rounded bg-muted" />)}
            </div>
          </div>

          {/* Premium badge */}
          {template.isPremium && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
              <Lock className="h-3 w-3" />
              {user?.plan === "pro" ? "Pro" : "Premium"}
            </div>
          )}

          {/* Lock overlay for inaccessible templates */}
          {!canAccess && (
            <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px] flex items-center justify-center">
              <div className="bg-background/90 rounded-full p-3 shadow-md">
                <Lock className="h-6 w-6 text-primary" />
              </div>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-3">
              {canAccess ? (
                <Link to={`/editor/new?template=${template.id}`}>
                  <Button variant="hero" size="sm">Use Template</Button>
                </Link>
              ) : (
                <Button variant="hero" size="sm" onClick={handleUseTemplate}>
                  {user ? "Upgrade to Pro" : "Get Started Free"}
                </Button>
              )}
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
          {template.isPremium && template.price && !canAccess && (
            <p className="text-sm font-semibold text-primary mt-2">${template.price.toFixed(2)} one-time</p>
          )}
          {template.isPremium && canAccess && (
            <p className="text-sm font-medium text-green-600 mt-2">✓ Included in your plan</p>
          )}
        </div>
      </div>

      {/* Auth modal for non-logged-in users */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />

      {/* Upgrade prompt for free users */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Upgrade to Pro
            </DialogTitle>
            <DialogDescription>
              The <strong>{template.name}</strong> template is available on the Pro plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-secondary/50 rounded-lg p-4 text-sm space-y-2">
              <p className="font-medium text-foreground">Pro includes:</p>
              <ul className="text-muted-foreground space-y-1">
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> All premium templates</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Unlimited PDF downloads</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Custom colors & fonts</li>
              </ul>
            </div>
            <Button variant="hero" className="w-full">
              Upgrade for $9/mo
            </Button>
            <Button variant="ghost" className="w-full text-sm" onClick={() => setUpgradeOpen(false)}>
              Continue with free templates
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateCard;