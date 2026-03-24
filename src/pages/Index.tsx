import { Navbar, HeroSection, FeaturesSection, PricingSection, Footer } from "@/components/landing/LandingSections";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <PricingSection />
    <Footer />
  </div>
);

export default Index;
