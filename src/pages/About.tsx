import GlassNavbar from "@/components/GlassNavbar";
import { Heart, Users, Shield, Zap, Target } from "lucide-react";
import aboutHeader from "@/assets/about-header.jpg";

const About = () => {
  const values = [
    {
      icon: <Heart size={28} />,
      title: "Compassionate Care",
      description: "We believe everyone deserves access to reliable health information and support, delivered with empathy and understanding."
    },
    {
      icon: <Users size={28} />,
      title: "Community Focused",
      description: "Building a supportive community where health and wellness knowledge is shared and everyone can thrive together."
    },
    {
      icon: <Shield size={28} />,
      title: "Trusted Information",
      description: "All our content is reviewed and based on evidence-based medical practices from credible sources."
    },
    {
      icon: <Zap size={28} />,
      title: "Instant Access",
      description: "Get immediate access to health resources and AI-powered assistance 24/7, whenever you need it most."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlassNavbar />
      
      <main className="pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section with Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={aboutHeader} 
                alt="Healthcare Professionals" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
            </div>
            <div className="relative text-center py-16 sm:py-20 md:py-24 px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                About Smart Health Assistant
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                Your trusted companion in health and wellness, powered by advanced AI technology
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 py-6">
            <div className="glass-panel bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-400/30 p-6 sm:p-8 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-green-500/20 rounded-xl">
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Mission</h2>
              </div>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Smart Health Assistant is dedicated to making quality health information accessible to everyone. 
                We combine cutting-edge AI technology with reliable medical knowledge to provide personalized 
                health guidance, diet planning, and wellness support. Our platform empowers individuals to 
                make informed decisions about their health and well-being.
              </p>
            </div>

            <div className="glass-panel bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-400/30 p-6 sm:p-8 hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 bg-blue-500/20 rounded-xl">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Vision</h2>
              </div>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                A world where everyone has access to intelligent health guidance and support, 
                enabling better health outcomes and improved quality of life through the power of
                artificial intelligence and personalized care. We envision a future where technology
                bridges healthcare gaps and empowers every individual.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Core Values */}
          <div className="py-6 space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                The principles that guide everything we do at Smart Health Assistant
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
              {values.map((value, index) => (
                <div 
                  key={index}
                  className="glass-panel bg-slate-800/50 border-white/10 p-6 sm:p-8 hover:border-green-400/30 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {value.icon}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
                        {value.title}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default About;
