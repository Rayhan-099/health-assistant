import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import GlassNavbar from '@/components/GlassNavbar';
import ClickSpark from '@/components/ClickSpark';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    age: '',
    gender: '',
    phone_number: '',
    medical_history: '',
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Fetch profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          phone_number: data.phone_number || '',
          medical_history: data.medical_history || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          age: profile.age ? parseInt(profile.age) : null,
          gender: profile.gender || null,
          phone_number: profile.phone_number,
          medical_history: profile.medical_history,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlassNavbar />
      
      <main className="pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="py-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Profile Settings
            </h1>
            <p className="text-xl text-slate-300">
              Manage your personal information and health preferences
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Profile Form Card */}
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-white text-3xl flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <User className="w-7 h-7 text-primary" />
                </div>
                Personal Information
              </CardTitle>
              <CardDescription className="text-slate-300 text-lg mt-3">
                Update your profile details to personalize your health tracking experience and receive tailored recommendations
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-white flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="0"
                      max="150"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Your age"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-white">Gender</Label>
                    <Select 
                      value={profile.gender} 
                      onValueChange={(value) => setProfile({ ...profile, gender: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        <SelectItem value="male" className="text-white">Male</SelectItem>
                        <SelectItem value="female" className="text-white">Female</SelectItem>
                        <SelectItem value="other" className="text-white">Other</SelectItem>
                        <SelectItem value="prefer_not_to_say" className="text-white">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-white flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number (for WhatsApp reminders)
                  </Label>
                  <Input
                    id="phone_number"
                    type="tel"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="+91 1234567890"
                  />
                  <p className="text-sm text-slate-400">
                    Add your phone number to receive vaccination reminders via WhatsApp
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medical_history" className="text-white flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Medical History (Optional)
                  </Label>
                  <Textarea
                    id="medical_history"
                    value={profile.medical_history}
                    onChange={(e) => setProfile({ ...profile, medical_history: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[120px]"
                    placeholder="Any relevant medical conditions, allergies, or ongoing treatments..."
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <ClickSpark
                    sparkColor="#71B280"
                    sparkSize={10}
                    sparkRadius={20}
                    sparkCount={8}
                    duration={500}
                  >
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="flex-1 bg-primary hover:bg-primary/90 h-12 text-base"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
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
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="border-white/10 hover:bg-white/5 h-12 px-8 text-base"
                    >
                      Cancel
                    </Button>
                  </ClickSpark>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* WhatsApp Info Card */}
          <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-400" />
                </div>
                WhatsApp Vaccination Reminders
              </h3>
              <p className="text-slate-300 text-base mb-4">
                Once you add your phone number, you'll receive automated WhatsApp reminders:
              </p>
              <ul className="list-disc list-inside text-slate-300 text-base space-y-2 ml-6">
                <li>3 days before your vaccination due date</li>
                <li>1 day before your vaccination due date</li>
                <li>On the day of your vaccination</li>
              </ul>
              <p className="text-slate-400 text-sm mt-6 p-4 bg-slate-800/50 rounded-lg">
                <strong>Note:</strong> WhatsApp integration requires administrator setup. Contact support if you're not receiving reminders.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}