import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-12 pb-6 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-green-400">Smart Health Assistant</h3>
            <p className="text-white/70 text-sm">
              Your trusted AI-powered health companion providing personalized health advice, diet planning, and wellness support.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/70 hover:text-green-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-green-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-white/70 hover:text-green-400 transition-colors text-sm">
                  Health Chatbot
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-white/70 hover:text-green-400 transition-colors text-sm">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li>AI Health Consultation</li>
              <li>Personalized Diet Planning</li>
              <li>Symptom Analysis</li>
              <li>Health Resources</li>
              <li>Vaccination Schedule</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Mail size={16} className="text-green-400" />
                <span>support@smart.health.assistant.com</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Phone size={16} className="text-green-400" />
                <span>+91 1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <MapPin size={16} className="text-green-400" />
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2025 Smart Health Assistant. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-400 fill-red-400" />
              <span>for better health</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
