import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Edit, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditVaccineDialog } from './EditVaccineDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VaccineCardProps {
  vaccine: {
    id: string;
    vaccine_name: string;
    dose_number: number;
    total_doses: number;
    date_taken: string | null;
    next_due_date: string | null;
    status: 'completed' | 'upcoming' | 'overdue';
    notes: string | null;
  };
  onUpdate: () => void;
}

export function VaccineCard({ vaccine, onUpdate }: VaccineCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getCardBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/20';
      case 'upcoming':
        return 'border-blue-500/30';
      case 'overdue':
        return 'border-red-500/30';
      default:
        return 'border-white/10';
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this vaccination record?')) return;

    try {
      const { error } = await supabase
        .from('vaccination_records')
        .delete()
        .eq('id', vaccine.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vaccination record deleted successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting vaccine:', error);
      toast({
        title: "Error",
        description: "Failed to delete vaccination record.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className={`bg-white/5 backdrop-blur-sm border ${getCardBorderColor(vaccine.status)} hover:bg-white/10 transition-all`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold text-white">
              {vaccine.vaccine_name}
            </CardTitle>
            <Badge className={getStatusColor(vaccine.status)}>
              {vaccine.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            Dose {vaccine.dose_number} of {vaccine.total_doses}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {vaccine.date_taken && (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Calendar className="w-4 h-4" />
              <span>Taken: {format(new Date(vaccine.date_taken), 'MMM dd, yyyy')}</span>
            </div>
          )}
          
          {vaccine.next_due_date && (
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className={`w-4 h-4 ${vaccine.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'}`} />
              <span className={vaccine.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'}>
                Due: {format(new Date(vaccine.next_due_date), 'MMM dd, yyyy')}
              </span>
            </div>
          )}

          {vaccine.notes && (
            <p className="text-sm text-slate-400 italic">
              {vaccine.notes}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="flex-1 border-white/10 hover:bg-white/5"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-red-500/30 hover:bg-red-500/10 text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditVaccineDialog
        vaccine={vaccine}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={onUpdate}
      />
    </>
  );
}