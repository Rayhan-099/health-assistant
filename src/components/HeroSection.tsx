import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import LiquidEther from "./LiquidEther";
import GlassSurface from "./GlassSurface";
import ClickSpark from "./ClickSpark";
import BlurText from "./BlurText";
import ScrollFloat from "./ScrollFloat";
import heroImage from "@/assets/hero-health.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 pb-12 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Health and Wellness" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      </div>
      
      {/* Liquid Ether Background */}
      <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
        <LiquidEther
          colors={['#71B280', '#134E5E', '#2D5F3F']}
          mouseForce={20}
          cursorSize={120}
          isViscous={true}
          viscous={40}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.2}
          autoIntensity={1.2}
          takeoverDuration={0.6}
          autoResumeDelay={5000}
          autoRampDuration={1.0}
        />
      </div>
      <div className="text-center max-w-4xl mx-auto relative z-10 px-4">
        {/* Main Headline */}
        <div className="mb-8">
          <BlurText
            text="Your Health, Our Priority"
            delay={150}
            animateBy="words"
            direction="top"
            className="text-5xl md:text-7xl font-bold text-white leading-tight"
            onAnimationComplete={() => console.log('Animation completed!')}
          />
        </div>

        {/* Subtext */}
        <div className="mb-12">
          <ScrollFloat
            containerClassName=""
            textClassName="text-xl md:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto !text-xl md:!text-2xl !font-normal"
          >
            Chat instantly with our Health Bot and explore wellness resources designed to support your journey to better health.
          </ScrollFloat>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4">
          <ClickSpark
            sparkColor="#ffffff"
            sparkSize={10}
            sparkRadius={20}
            sparkCount={8}
            duration={500}
          >
            <Link
              to="/chatbot"
              className="w-full sm:w-auto bg-black/20 backdrop-blur-sm text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/20 hover:bg-black/30 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <MessageCircle size={20} />
              <span>Get Started</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </ClickSpark>
          
          <ClickSpark
            sparkColor="#71B280"
            sparkSize={10}
            sparkRadius={20}
            sparkCount={8}
            duration={500}
          >
            <Link
              to="/about"
              className="w-full sm:w-auto bg-black/20 backdrop-blur-sm text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl border border-white/20 hover:bg-black/30 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Learn More</span>
            </Link>
          </ClickSpark>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;