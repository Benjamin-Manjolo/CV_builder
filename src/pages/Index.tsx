import Navbar from "@/components/Navbar";
import { HeroSection, FeaturesSection, PricingSection, Footer } from "@/components/LandingSections";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;