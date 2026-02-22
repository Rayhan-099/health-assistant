import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface VaccineTemplate {
  id: string;
  vaccine_name: string;
  category: string;
  description: string;
  total_doses: number;
  interval_days: number | null;
}

interface AddVaccineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddVaccineDialog({ open, onOpenChange, onSuccess }: AddVaccineDialogProps) {
  const [templates, setTemplates] = useState<VaccineTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<VaccineTemplate | null>(null);
  const [customVaccine, setCustomVaccine] = useState(false);
  const [formData, setFormData] = useState({
    vaccine_name: '',
    dose_number: 1,
    total_doses: 1,
    date_taken: null as Date | null,
    next_due_date: null as Date | null,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccine_templates')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setFormData(prev => ({
        ...prev,
        vaccine_name: template.vaccine_name,
        total_doses: template.total_doses,
      }));
    }
  };

  const calculateNextDueDate = (dateTaken: Date | null, intervalDays: number | null): Date | null => {
    if (!dateTaken || !intervalDays) return null;
    const nextDate = new Date(dateTaken);
    nextDate.setDate(nextDate.getDate() + intervalDays);
    return nextDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let nextDue = formData.next_due_date;
      
      // Auto-calculate next due date if template has interval and this isn't the last dose
      if (selectedTemplate?.interval_days && formData.dose_number < formData.total_doses && formData.date_taken) {
        nextDue = calculateNextDueDate(formData.date_taken, selectedTemplate.interval_days);
      }

      const { error } = await supabase
        .from('vaccination_records')
        .insert({
          user_id: user.id,
          vaccine_name: formData.vaccine_name,
          dose_number: formData.dose_number,
          total_doses: formData.total_doses,
          date_taken: formData.date_taken?.toISOString().split('T')[0] || null,
          next_due_date: nextDue?.toISOString().split('T')[0] || null,
          notes: formData.notes,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Vaccination record added successfully.",
      });

      // Reset form
      setFormData({
        vaccine_name: '',
        dose_number: 1,
        total_doses: 1,
        date_taken: null,
        next_due_date: null,
        notes: '',
      });
      setSelectedTemplate(null);
      setCustomVaccine(false);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding vaccine:', error);
      toast({
        title: "Error",
        description: "Failed to add vaccination record.",
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
          <DialogTitle className="text-white">Add Vaccination Record</DialogTitle>
          <DialogDescription className="text-slate-300">
            Add a new vaccination to your health records.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!customVaccine ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="template" className="text-white">Select Vaccine</Label>
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Choose from common vaccines" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10">
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id} className="text-white">
                        {template.vaccine_name} - {template.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                variant="link"
                onClick={() => setCustomVaccine(true)}
                className="text-primary"
              >
                Or enter custom vaccine
              </Button>
            </>
          ) : (
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
          )}

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
            <Label className="text-white">Next Due Date (Optional)</Label>
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
            <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !formData.vaccine_name} className="flex-1">
              {loading ? 'Adding...' : 'Add Vaccine Record'}
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