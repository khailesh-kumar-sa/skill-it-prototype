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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      free_trial_usage: {
        Row: {
          created_at: string
          id: string
          mobile_number: string
          trial_expires_at: string
          trial_started_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mobile_number: string
          trial_expires_at?: string
          trial_started_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mobile_number?: string
          trial_expires_at?: string
          trial_started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      peer_reviews: {
        Row: {
          communication_rating: number
          created_at: string
          id: string
          is_teacher_review: boolean
          knowledge_rating: number
          overall_rating: number
          reviewee_id: string
          reviewer_id: string
          session_id: string
          teaching_rating: number
          written_feedback: string | null
        }
        Insert: {
          communication_rating: number
          created_at?: string
          id?: string
          is_teacher_review?: boolean
          knowledge_rating: number
          overall_rating: number
          reviewee_id: string
          reviewer_id: string
          session_id: string
          teaching_rating: number
          written_feedback?: string | null
        }
        Update: {
          communication_rating?: number
          created_at?: string
          id?: string
          is_teacher_review?: boolean
          knowledge_rating?: number
          overall_rating?: number
          reviewee_id?: string
          reviewer_id?: string
          session_id?: string
          teaching_rating?: number
          written_feedback?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "peer_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "skill_swap_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          interests: string | null
          mobile_number: string | null
          name: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string | null
          mobile_number?: string | null
          name: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          interests?: string | null
          mobile_number?: string | null
          name?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          created_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          skill_offering_id: string | null
          time_taken_seconds: number | null
          user_id: string
        }
        Insert: {
          answers: Json
          created_at?: string
          id?: string
          passed: boolean
          quiz_id: string
          score: number
          skill_offering_id?: string | null
          time_taken_seconds?: number | null
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          skill_offering_id?: string | null
          time_taken_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "skill_quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_skill_offering_id_fkey"
            columns: ["skill_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_offerings: {
        Row: {
          approval_status: string | null
          created_at: string
          demo_video_approved: boolean | null
          demo_video_url: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          level: string
          max_learners: number | null
          prerequisites: string | null
          quiz_passed: boolean | null
          skill_category: string
          skill_name: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          created_at?: string
          demo_video_approved?: boolean | null
          demo_video_url?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          level: string
          max_learners?: number | null
          prerequisites?: string | null
          quiz_passed?: boolean | null
          skill_category: string
          skill_name: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          created_at?: string
          demo_video_approved?: boolean | null
          demo_video_url?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          level?: string
          max_learners?: number | null
          prerequisites?: string | null
          quiz_passed?: boolean | null
          skill_category?: string
          skill_name?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_quizzes: {
        Row: {
          created_at: string
          id: string
          passing_score: number | null
          questions: Json
          skill_category: string
          skill_level: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          passing_score?: number | null
          questions: Json
          skill_category: string
          skill_level: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          passing_score?: number | null
          questions?: Json
          skill_category?: string
          skill_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      skill_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          requested_date: string | null
          requester_id: string
          skill_offering_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          requested_date?: string | null
          requester_id: string
          skill_offering_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          requested_date?: string | null
          requester_id?: string
          skill_offering_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_requests_skill_offering_id_fkey"
            columns: ["skill_offering_id"]
            isOneToOne: false
            referencedRelation: "skill_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_swap_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          learner_id: string
          session_date: string
          skill_taught: string
          status: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          learner_id: string
          session_date: string
          skill_taught: string
          status?: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          learner_id?: string
          session_date?: string
          skill_taught?: string
          status?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trust_scores: {
        Row: {
          avg_communication_rating: number | null
          avg_knowledge_rating: number | null
          avg_teaching_rating: number | null
          completed_sessions: number
          created_at: string
          id: string
          last_calculated: string
          overall_score: number
          total_reviews: number
          trust_level: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_communication_rating?: number | null
          avg_knowledge_rating?: number | null
          avg_teaching_rating?: number | null
          completed_sessions?: number
          created_at?: string
          id?: string
          last_calculated?: string
          overall_score?: number
          total_reviews?: number
          trust_level?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_communication_rating?: number | null
          avg_knowledge_rating?: number | null
          avg_teaching_rating?: number | null
          completed_sessions?: number
          created_at?: string
          id?: string
          last_calculated?: string
          overall_score?: number
          total_reviews?: number
          trust_level?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_skill_offering: {
        Args: { skill_id: string }
        Returns: undefined
      }
      calculate_trust_score: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      check_mobile_trial_eligibility: {
        Args: { mobile_num: string }
        Returns: boolean
      }
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
