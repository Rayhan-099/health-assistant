export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          full_name: string | null
          gender: string | null
          id: string
          medical_history: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          medical_history?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          medical_history?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vaccination_records: {
        Row: {
          created_at: string | null
          date_taken: string | null
          dose_number: number | null
          id: string
          next_due_date: string | null
          notes: string | null
          reminder_sent: boolean | null
          status: Database["public"]["Enums"]["vaccination_status"] | null
          total_doses: number | null
          updated_at: string | null
          user_id: string
          vaccine_name: string
        }
        Insert: {
          created_at?: string | null
          date_taken?: string | null
          dose_number?: number | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          status?: Database["public"]["Enums"]["vaccination_status"] | null
          total_doses?: number | null
          updated_at?: string | null
          user_id: string
          vaccine_name: string
        }
        Update: {
          created_at?: string | null
          date_taken?: string | null
          dose_number?: number | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          reminder_sent?: boolean | null
          status?: Database["public"]["Enums"]["vaccination_status"] | null
          total_doses?: number | null
          updated_at?: string | null
          user_id?: string
          vaccine_name?: string
        }
        Relationships: []
      }
      vaccination_reminders: {
        Row: {
          created_at: string | null
          id: string
          reminder_date: string
          reminder_type: string
          sent: boolean | null
          sent_at: string | null
          user_id: string
          vaccination_record_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reminder_date: string
          reminder_type: string
          sent?: boolean | null
          sent_at?: string | null
          user_id: string
          vaccination_record_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reminder_date?: string
          reminder_type?: string
          sent?: boolean | null
          sent_at?: string | null
          user_id?: string
          vaccination_record_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_reminders_vaccination_record_id_fkey"
            columns: ["vaccination_record_id"]
            isOneToOne: false
            referencedRelation: "vaccination_records"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccine_templates: {
        Row: {
          age_group: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          interval_days: number | null
          is_active: boolean | null
          total_doses: number | null
          vaccine_name: string
        }
        Insert: {
          age_group?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          interval_days?: number | null
          is_active?: boolean | null
          total_doses?: number | null
          vaccine_name: string
        }
        Update: {
          age_group?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          interval_days?: number | null
          is_active?: boolean | null
          total_doses?: number | null
          vaccine_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      vaccination_status: "completed" | "upcoming" | "overdue"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      vaccination_status: ["completed", "upcoming", "overdue"],
    },
  },
} as const
