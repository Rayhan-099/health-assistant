import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface EditVaccineDialogProps {
  vaccine: {
    id: string;
    vaccine_name: string;
    dose_number: number;
    total_doses: number;
    date_taken: string | null;
    next_due_date: string | null;
    notes: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditVaccineDialog({ vaccine, open, onOpenChange, onSuccess }: EditVaccineDialogProps) {
  const [formData, setFormData] = useState({
    vaccine_name: vaccine.vaccine_name,
    dose_number: vaccine.dose_number,
    total_doses: vaccine.total_doses,
    date_taken: vaccine.date_taken ? new Date(vaccine.date_taken) : null,
    next_due_date: vaccine.next_due_date ? new Date(vaccine.next_due_date) : null,
    notes: vaccine.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      vaccine_name: vaccine.vaccine_name,
      dose_number: vaccine.dose_number,
      total_doses: vaccine.total_doses,
      date_taken: vaccine.date_taken ? new Date(vaccine.date_taken) : null,
      next_due_date: vaccine.next_due_date ? new Date(vaccine.next_due_date) : null,
      notes: vaccine.notes || '',
    });
  }, [vaccine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('vaccination_records')
        .update({
          vaccine_name: formData.vaccine_name,
          dose_number: formData.dose_number,
          total_doses: formData.total_doses,
          date_taken: formData.date_taken?.toISOString().split('T')[0] || null,
          next_due_date: formData.next_due_date?.toISOString().split('T')[0] || null,
          notes: formData.notes,
        })
        .eq('id', vaccine.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vaccination record updated successfully.",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating vaccine:', error);
      toast({
        title: "Error",
        description: "Failed to update vaccination record.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Vaccination Record</DialogTitle>
          <DialogDescription className="text-slate-300">
            Update your vaccination details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vaccine_name" className="text-white">Vaccine Name</Label>
            <Input
              id="vaccine_name"
              value={formData.vaccine_name}
              onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dose_number" className="text-white">Dose Number</Label>
              <Input
                id="dose_number"
                type="number"
                min="1"
                value={formData.dose_number}
                onChange={(e) => setFormData({ ...formData, dose_number: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_doses" className="text-white">Total Doses</Label>
              <Input
                id="total_doses"
                type="number"
                min="1"
                value={formData.total_doses}
                onChange={(e) => setFormData({ ...formData, total_doses: parseInt(e.target.value) })}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Date Taken</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date_taken ? format(formData.date_taken, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                <Calendar
                  mode="single"
                  selected={formData.date_taken || undefined}
                  onSelect={(date) => setFormData({ ...formData, date_taken: date || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Next Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left bg-white/5 border-white/10 text-white hover:bg-white/10"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.next_due_date ? format(formData.next_due_date, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-white/10">
                <Calendar
                  mode="single"
                  selected={formData.next_due_date || undefined}
                  onSelect={(date) => setFormData({ ...formData, next_due_date: date || null })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-white">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Updating...' : 'Update Record'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-white/10">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}