import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ open, onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">(defaultTab);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setError(""); setLoading(false);
  };

  const switchTab = (t: "login" | "signup") => { setTab(t); reset(); };

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    if (tab === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const result = tab === "login"
      ? await login(email, password)
      : await signup(name, email, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-heading font-bold text-lg text-foreground">CraftCV</span>
          </div>
          <DialogTitle className="font-heading text-xl">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-muted p-1 gap-1 mb-2">
          {(["login", "signup"] as const).map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                tab === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {tab === "signup" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full name</label>
              <Input
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <Input
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">{error}</p>
          )}

          <Button
            variant="hero"
            className="w-full mt-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {tab === "login" ? "Logging in…" : "Creating account…"}</>
            ) : (
              tab === "login" ? "Log in" : "Create account"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchTab(tab === "login" ? "signup" : "login")}
              className="text-primary hover:underline font-medium"
            >
              {tab === "login" ? "Sign up free" : "Log in"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}