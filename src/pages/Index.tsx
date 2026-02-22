import GlassNavbar from "@/components/GlassNavbar";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import FeedbackSection from "@/components/FeedbackSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <GlassNavbar />
      <div className="pt-20">
        <HeroSection />
        <FeatureCards />
        <FeedbackSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
