import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download, Wifi, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/Auth/AuthContext";
import { AuthModal } from "@/components/Auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar = ({ onLoginClick }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const openLogin = () => { setAuthTab("login"); setAuthOpen(true); onLoginClick?.(); };
  const openSignup = () => { setAuthTab("signup"); setAuthOpen(true); onLoginClick?.(); };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold text-foreground">CraftCV</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/templates" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Templates
            </Link>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
                    {user.plan === "pro" && (
                      <span className="text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">Pro</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/templates">Browse Templates</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={openLogin}>Log in</Button>
                <Button variant="hero" size="sm" onClick={openSignup}>Get Started Free</Button>
              </>
            )}
          </div>
        </div>
      </nav>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab={authTab} />
    </>
  );
};

const HeroSection = () => {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4 animate-fade-in">
            Professional CV Builder
          </p>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-up">
            Craft a CV That Opens Doors
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Choose from professionally designed templates, edit in your browser, and download a polished PDF — all in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/templates">
              <Button variant="hero" size="lg" className="text-base px-8">Browse Templates</Button>
            </Link>
            <Button variant="hero-outline" size="lg" className="text-base px-8" onClick={() => setAuthOpen(true)}>
              Get Started Free
            </Button>
          </div>
        </div>
      </section>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
    </>
  );
};

const features = [
  { icon: Sparkles, title: "Beautiful Templates", description: "Professionally designed CV templates for every industry and career stage." },
  { icon: FileText, title: "In-Browser Editor", description: "Edit your CV with our intuitive editor — no software downloads needed." },
  { icon: Download, title: "Instant PDF Download", description: "Export your finished CV as a pixel-perfect PDF with a single click." },
  { icon: Wifi, title: "Works Offline", description: "Once loaded, edit and download your CV even without an internet connection." },
];

const FeaturesSection = () => (
  <section id="features" className="py-20 px-4 bg-secondary/50">
    <div className="container mx-auto max-w-5xl">
      <div className="text-center mb-16">
        <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Features</p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Everything You Need</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-background rounded-lg p-8 shadow-soft hover:shadow-card transition-shadow duration-300">
            <f.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = () => {
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <>
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <p className="text-sm font-medium tracking-widest uppercase text-primary mb-3">Pricing</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Simple, Transparent Pricing</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-background rounded-lg p-8 shadow-soft border">
              <h3 className="font-heading text-xl font-semibold mb-2">Free</h3>
              <p className="text-3xl font-bold text-foreground mb-1">$0</p>
              <p className="text-sm text-muted-foreground mb-6">Forever free</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> 3 free templates</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> In-browser editor</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> PDF download</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Offline editing</li>
              </ul>
              <Button variant="hero-outline" className="w-full" onClick={() => setAuthOpen(true)}>Get Started</Button>
            </div>
            <div className="bg-background rounded-lg p-8 shadow-elevated border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Pro Monthly</h3>
              <p className="text-3xl font-bold text-foreground mb-1">$9<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <p className="text-sm text-muted-foreground mb-6">Cancel anytime</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> All templates</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Unlimited downloads</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Custom colors & fonts</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Priority support</li>
              </ul>
              <Button variant="hero" className="w-full" onClick={() => setAuthOpen(true)}>Start Pro</Button>
            </div>
            <div className="bg-background rounded-lg p-8 shadow-soft border">
              <h3 className="font-heading text-xl font-semibold mb-2">Pro Yearly</h3>
              <p className="text-3xl font-bold text-foreground mb-1">$69<span className="text-base font-normal text-muted-foreground">/yr</span></p>
              <p className="text-sm text-muted-foreground mb-6">Save 36%</p>
              <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Everything in Pro</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> DOCX export</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Early access to new templates</li>
                <li className="flex items-center gap-2"><span className="text-primary">✓</span> Best value</li>
              </ul>
              <Button variant="hero-outline" className="w-full" onClick={() => setAuthOpen(true)}>Start Pro Yearly</Button>
            </div>
          </div>
        </div>
      </section>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="signup" />
    </>
  );
};

const Footer = () => (
  <footer className="py-12 px-4 border-t bg-secondary/30">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <span className="font-heading font-bold text-foreground">CraftCV</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} CraftCV. All rights reserved.
      </p>
    </div>
  </footer>
);

export { HeroSection, FeaturesSection, PricingSection, Footer };
