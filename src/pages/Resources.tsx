import GlassNavbar from "@/components/GlassNavbar";
import { ExternalLink, Download, BookOpen, Video, FileText, Heart } from "lucide-react";
import resourcesHeader from "@/assets/resources-header.jpg";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Nutrition Guides",
      icon: <BookOpen size={28} />,
      color: "from-green-500 to-emerald-500",
      resources: [
        { name: "Balanced Diet Essentials", type: "PDF Guide", link: "#" },
        { name: "Meal Planning Template", type: "Download", link: "#" },
        { name: "Healthy Recipes Collection", type: "Web Resource", link: "#" }
      ]
    },
    {
      title: "Exercise & Fitness",
      icon: <Video size={28} />,
      color: "from-blue-500 to-cyan-500",
      resources: [
        { name: "Beginner Workout Routines", type: "Video Series", link: "#" },
        { name: "Stretching Guide", type: "PDF Guide", link: "#" },
        { name: "Fitness Tracker Template", type: "Download", link: "#" }
      ]
    },
    {
      title: "Mental Health",
      icon: <Heart size={28} />,
      color: "from-purple-500 to-pink-500",
      resources: [
        { name: "Stress Management Techniques", type: "Article", link: "#" },
        { name: "Mindfulness Meditation Guide", type: "Audio Guide", link: "#" },
        { name: "Sleep Hygiene Checklist", type: "PDF Guide", link: "#" }
      ]
    },
    {
      title: "Emergency Care",
      icon: <ExternalLink size={28} />,
      color: "from-red-500 to-orange-500",
      resources: [
        { name: "Basic First Aid Manual", type: "PDF Guide", link: "#" },
        { name: "Emergency Contacts Template", type: "Download", link: "#" },
        { name: "CPR Quick Reference", type: "Infographic", link: "#" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlassNavbar />
      
      <main className="pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header with Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={resourcesHeader} 
                alt="Health Resources" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
            </div>
            <div className="relative text-center py-16 sm:py-20 md:py-24 px-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Health Resources
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto leading-relaxed">
                Comprehensive guides and resources to support your health journey
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Resource Categories */}
          <div className="py-6">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {resourceCategories.map((category, index) => (
                <div 
                  key={index}
                  className="glass-panel bg-slate-800/50 border-white/10 p-6 sm:p-8 hover:border-green-400/30 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {category.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.link}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all group/item border border-white/10 hover:border-green-400/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full group-hover/item:scale-150 transition-transform"></div>
                          <div>
                            <p className="text-white font-medium group-hover/item:text-green-400 transition-colors text-base">
                              {resource.name}
                            </p>
                            <p className="text-white/60 text-sm">{resource.type}</p>
                          </div>
                        </div>
                        <ExternalLink size={20} className="text-white/60 group-hover/item:text-green-400 transition-colors flex-shrink-0" />
                      </a>
                    ))}
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

export default Resources;
