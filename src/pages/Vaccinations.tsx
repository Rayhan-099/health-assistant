import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import GlassNavbar from '@/components/GlassNavbar';
import ClickSpark from '@/components/ClickSpark';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddVaccineDialog } from '@/components/vaccination/AddVaccineDialog';
import { VaccineCard } from '@/components/vaccination/VaccineCard';

interface VaccinationRecord {
  id: string;
  vaccine_name: string;
  dose_number: number;
  total_doses: number;
  date_taken: string | null;
  next_due_date: string | null;
  status: 'completed' | 'upcoming' | 'overdue';
  notes: string | null;
}

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to view your vaccinations.",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('vaccination_records')
        .select('*')
        .eq('user_id', user.id)
        .order('next_due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setVaccinations(data || []);
    } catch (error) {
      console.error('Error fetching vaccinations:', error);
      toast({
        title: "Error",
        description: "Failed to load vaccination records.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const upcomingVaccinations = vaccinations.filter(v => v.status === 'upcoming' || v.status === 'overdue');
  const completedVaccinations = vaccinations.filter(v => v.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <GlassNavbar />
      
      <main className="pt-28 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 py-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Vaccination Schedule
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl">
                Track and manage your vaccination records, get reminders, and stay up to date with your health
              </p>
            </div>
            <ClickSpark
              sparkColor="#71B280"
              sparkSize={10}
              sparkRadius={20}
              sparkCount={8}
              duration={500}
            >
              <Button 
                onClick={() => setShowAddDialog(true)}
                className="bg-primary hover:bg-primary/90 h-12 px-6 text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Vaccine Record
              </Button>
            </ClickSpark>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10"></div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-slate-300 flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  Upcoming Vaccinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-400 mb-1">
                  {upcomingVaccinations.filter(v => v.status === 'upcoming').length}
                </div>
                <p className="text-sm text-slate-400">Scheduled appointments</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-slate-300 flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-400 mb-1">
                  {upcomingVaccinations.filter(v => v.status === 'overdue').length}
                </div>
                <p className="text-sm text-slate-400">Requires attention</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-medium text-slate-300 flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-400 mb-1">
                  {completedVaccinations.length}
                </div>
                <p className="text-sm text-slate-400">Total vaccinations</p>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="text-center text-slate-300 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-lg">Loading your vaccination records...</p>
            </div>
          ) : (
            <div className="space-y-10 py-6">
              {/* Upcoming Vaccinations */}
              {upcomingVaccinations.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Upcoming Vaccinations
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {upcomingVaccinations.length} vaccination{upcomingVaccinations.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingVaccinations.map((vaccine) => (
                      <VaccineCard
                        key={vaccine.id}
                        vaccine={vaccine}
                        onUpdate={fetchVaccinations}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Completed Vaccinations */}
              {completedVaccinations.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        Completed Vaccinations
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {completedVaccinations.length} vaccination{completedVaccinations.length !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedVaccinations.map((vaccine) => (
                      <VaccineCard
                        key={vaccine.id}
                        vaccine={vaccine}
                        onUpdate={fetchVaccinations}
                      />
                    ))}
                  </div>
                </section>
              )}

              {vaccinations.length === 0 && (
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                  <CardContent className="py-20 text-center">
                    <div className="p-6 bg-blue-500/10 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <Calendar className="w-14 h-14 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      No vaccination records yet
                    </h3>
                    <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
                      Start tracking your vaccinations by adding your first record. Keep your health on track with timely reminders.
                    </p>
                    <Button 
                      onClick={() => setShowAddDialog(true)}
                      className="bg-primary hover:bg-primary/90 h-12 px-8 text-base"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Vaccine
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      <AddVaccineDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchVaccinations}
      />
    </div>
  );
}