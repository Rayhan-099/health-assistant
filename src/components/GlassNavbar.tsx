import { useState, useEffect } from "react";
import { Menu, X, LogIn, LayoutDashboard, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ClickSpark from "./ClickSpark";
import BubbleMenu from "./BubbleMenu";
import { supabase } from "@/integrations/supabase/client";
import logo from '@/assets/logo-main.png';

const GlassNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Chatbot", path: "/chatbot" },
    { name: "Resources", path: "/resources" },
  ];

  return (
    <>
      <BubbleMenu 
        isAuthenticated={!!user} 
        onLogout={() => supabase.auth.signOut()} 
      />
      
      <nav className="bg-white/5 backdrop-blur-lg border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:py-5">
          
          
          {/* Logo & Name */}
          <ClickSpark
            sparkColor="#71B280"
            sparkSize={8}
            sparkRadius={15}
            sparkCount={6}
            duration={400}
          >
            <Link to="/" className="flex items-center gap-3 md:gap-4">
              <img 
                src={logo} 
                alt="Smart Health Assistant Logo" 
                className="h-10 md:h-12 lg:h-14 w-auto object-contain" 
              />
              <span className="text-lg md:text-xl lg:text-2xl font-bold text-white whitespace-nowrap">
                Smart Health Assistant
              </span>
            </Link>
          </ClickSpark>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            <div className="flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => (
                <ClickSpark
                  key={link.name}
                  sparkColor="#71B280"
                  sparkSize={6}
                  sparkRadius={12}
                  sparkCount={5}
                  duration={300}
                >
                  <Link
                    to={link.path}
                    className={`text-white/90 hover:text-white transition-colors duration-300 font-medium px-3 xl:px-4 py-2 rounded-lg hover:bg-white/10 text-sm ${
                      location.pathname === link.path ? "text-white bg-white/10" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </ClickSpark>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-2 xl:ml-4">
              {user && (
                <>
                  <ClickSpark
                    sparkColor="#71B280"
                    sparkSize={8}
                    sparkRadius={15}
                    sparkCount={6}
                    duration={400}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-sm h-9"
                      onClick={() => navigate('/dashboard')}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-1.5" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Button>
                  </ClickSpark>
                  
                  <ClickSpark
                    sparkColor="#71B280"
                    sparkSize={8}
                    sparkRadius={15}
                    sparkCount={6}
                    duration={400}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-sm h-9"
                      onClick={() => navigate('/profile')}
                    >
                      <User className="w-4 h-4 mr-1.5" />
                      <span className="hidden xl:inline">Profile</span>
                    </Button>
                  </ClickSpark>
                </>
              )}
              
              {!user ? (
                <ClickSpark
                  sparkColor="#71B280"
                  sparkSize={8}
                  sparkRadius={15}
                  sparkCount={6}
                  duration={400}
                >
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-sm h-9">
                      <LogIn className="w-4 h-4 mr-1.5" />
                      <span className="hidden xl:inline">Login</span>
                    </Button>
                  </Link>
                </ClickSpark>
              ) : (
                <ClickSpark
                  sparkColor="#71B280"
                  sparkSize={8}
                  sparkRadius={15}
                  sparkCount={6}
                  duration={400}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 text-sm h-9"
                    onClick={() => supabase.auth.signOut()}
                  >
                    <span className="hidden xl:inline">Logout</span>
                    <span className="xl:hidden">Exit</span>
                  </Button>
                </ClickSpark>
              )}
            </div>
          </div>

          {/* Mobile Quick Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <ClickSpark
                sparkColor="#71B280"
                sparkSize={6}
                sparkRadius={12}
                sparkCount={4}
                duration={300}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 px-3"
                  onClick={() => navigate('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4" />
                </Button>
              </ClickSpark>
            )}
            
            {!user && (
              <ClickSpark
                sparkColor="#71B280"
                sparkSize={6}
                sparkRadius={12}
                sparkCount={4}
                duration={300}
              >
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 px-3">
                    <LogIn className="w-4 h-4" />
                  </Button>
                </Link>
              </ClickSpark>
            )}
          </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default GlassNavbar;
