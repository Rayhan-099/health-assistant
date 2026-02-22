import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate reminder dates
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysDate = threeDaysLater.toISOString().split('T')[0];

    const oneDayLater = new Date();
    oneDayLater.setDate(oneDayLater.getDate() + 1);
    const oneDayDate = oneDayLater.toISOString().split('T')[0];

    // Fetch vaccinations due in 3 days, 1 day, or today
    const { data: dueVaccinations, error: fetchError } = await supabaseClient
      .from('vaccination_records')
      .select(`
        id,
        vaccine_name,
        next_due_date,
        user_id,
        profiles!inner(full_name, phone_number)
      `)
      .in('next_due_date', [today, oneDayDate, threeDaysDate])
      .eq('status', 'upcoming')
      .eq('reminder_sent', false);

    if (fetchError) throw fetchError;

    console.log(`Found ${dueVaccinations?.length || 0} vaccinations due for reminders`);

    const results = [];

    for (const vaccination of (dueVaccinations || [])) {
      const profile = vaccination.profiles as any;
      if (!profile?.phone_number) {
        console.log(`Skipping vaccination ${vaccination.id} - no phone number`);
        continue;
      }

      // Determine reminder type
      let reminderType = 'due_date';
      let daysUntil = 0;
      
      if (vaccination.next_due_date === threeDaysDate) {
        reminderType = '3_days_before';
        daysUntil = 3;
      } else if (vaccination.next_due_date === oneDayDate) {
        reminderType = '1_day_before';
        daysUntil = 1;
      }

      // Create personalized message
      const message = daysUntil > 0
        ? `Hi ${profile.full_name || 'there'}, your ${vaccination.vaccine_name} vaccination is due in ${daysUntil} day${daysUntil > 1 ? 's' : ''} on ${vaccination.next_due_date}. Please don't forget your appointment! - Smart Health Assistant`
        : `Hi ${profile.full_name || 'there'}, your ${vaccination.vaccine_name} vaccination is due today! Please don't forget your appointment. - Smart Health Assistant`;

      // Here you would integrate with WhatsApp Business API
      // For now, we'll just log and store the reminder
      console.log(`Would send to ${profile.phone_number}: ${message}`);

      // Store reminder record
      const { error: reminderError } = await supabaseClient
        .from('vaccination_reminders')
        .insert({
          vaccination_record_id: vaccination.id,
          user_id: vaccination.user_id,
          reminder_date: vaccination.next_due_date,
          reminder_type: reminderType,
          sent: true,
          sent_at: new Date().toISOString(),
        });

      if (reminderError) {
        console.error('Error storing reminder:', reminderError);
      }

      // Mark vaccination as reminder_sent
      const { error: updateError } = await supabaseClient
        .from('vaccination_records')
        .update({ reminder_sent: true })
        .eq('id', vaccination.id);

      if (updateError) {
        console.error('Error updating vaccination record:', updateError);
      }

      results.push({
        vaccination_id: vaccination.id,
        phone: profile.phone_number,
        message,
        status: 'sent',
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.length} vaccination reminders`,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in vaccination-reminders function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});