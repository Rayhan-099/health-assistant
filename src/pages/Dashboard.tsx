import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import GlassNavbar from "@/components/GlassNavbar";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import DietPlannerChat from "@/components/DietPlannerChat";
import ClickSpark from "@/components/ClickSpark";
import { Calendar, Users, FileText, Stethoscope, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDietPlanner, setShowDietPlanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const dashboardFeatures = [
    {
      title: "Vaccination Schedules",
      description: "Track and manage your vaccination appointments and reminders",
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      action: () => navigate("/vaccinations")
    },
    {
      title: "Personalized Health & Diet Planner",
      description: "Get customized health and nutrition plans based on your profile",
      icon: Users,
      color: "from-green-500 to-green-600",
      action: () => console.log("Diet planner feature coming soon")
    },
    {
      title: "Report Analyzer",
      description: "Upload and analyze your medical reports with AI assistance",
      icon: FileText,
      color: "from-purple-500 to-purple-600",
      action: () => navigate("/report-analyzer")
    },
    {
      title: "Symptoms to Disease Analysis",
      description: "Get insights about potential conditions based on your symptoms",
      icon: Stethoscope,
      color: "from-red-500 to-red-600",
      action: () => console.log("Symptom analyzer feature coming soon")
    },
    {
      title: "Health Chatbot",
      description: "Chat with our AI health assistant for instant support",
      icon: Bot,
      color: "from-teal-500 to-teal-600",
      action: () => navigate("/chatbot")
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlassNavbar />
      
      <ScrollStack
        itemDistance={80}
        itemScale={0.05}
        itemStackDistance={40}
        stackPosition="25%"
        scaleEndPosition="15%"
        baseScale={0.9}
      >
        {/* Welcome Card */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-900/40 to-teal-900/40 backdrop-blur-md border border-white/20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome Back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Your personal health dashboard - track, analyze, and improve your wellness journey
            </p>
          </div>
        </ScrollStackItem>

        {/* Vaccination Schedules */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-md border border-blue-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Vaccination Schedules</h2>
                <p className="text-white/70 text-lg">Track and manage your vaccination appointments and reminders</p>
              </div>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={8}
              sparkRadius={15}
              sparkCount={6}
              duration={400}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                onClick={() => navigate("/vaccinations")}
              >
                Start Now
              </Button>
            </ClickSpark>
          </div>
        </ScrollStackItem>

        {/* Personalized Health & Diet Planner */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md border border-green-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Personalized Health & Diet Planner</h2>
                <p className="text-white/70 text-lg">Get customized health and nutrition plans based on your profile</p>
              </div>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={8}
              sparkRadius={15}
              sparkCount={6}
              duration={400}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                onClick={() => setShowDietPlanner(true)}
              >
                Start Planning
              </Button>
            </ClickSpark>
          </div>
        </ScrollStackItem>

        {/* Report Analyzer */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md border border-purple-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Report Analyzer</h2>
                <p className="text-white/70 text-lg">Upload and analyze your medical reports with AI assistance</p>
              </div>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={8}
              sparkRadius={15}
              sparkCount={6}
              duration={400}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                onClick={() => navigate("/report-analyzer")}
              >
                Check Now
              </Button>
            </ClickSpark>
          </div>
        </ScrollStackItem>

        {/* Symptoms to Disease Analysis */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-md border border-red-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Symptoms to Disease Analysis</h2>
                <p className="text-white/70 text-lg">Get insights about potential conditions based on your symptoms</p>
              </div>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={8}
              sparkRadius={15}
              sparkCount={6}
              duration={400}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                onClick={() => console.log("Symptom analyzer feature coming soon")}
              >
                Coming Soon
              </Button>
            </ClickSpark>
          </div>
        </ScrollStackItem>

        {/* Health Chatbot */}
        <ScrollStackItem itemClassName="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-md border border-teal-400/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Health Chatbot</h2>
                <p className="text-white/70 text-lg">Chat with our AI health assistant for instant support</p>
              </div>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={8}
              sparkRadius={15}
              sparkCount={6}
              duration={400}
            >
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 whitespace-nowrap"
                onClick={() => navigate("/chatbot")}
              >
                Start Chat
              </Button>
            </ClickSpark>
          </div>
        </ScrollStackItem>
      </ScrollStack>

      {showDietPlanner && <DietPlannerChat onClose={() => setShowDietPlanner(false)} />}
    </div>
  );
};

export default Dashboard;