export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      analytic_points: {
        Row: {
          analytic_id: number;
          case_id: number;
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id: number;
          score: number;
          text_found: boolean;
        };
        Insert: {
          analytic_id: number;
          case_id: number;
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id?: number;
          score: number;
          text_found: boolean;
        };
        Update: {
          analytic_id?: number;
          case_id?: number;
          category?: Database["public"]["Enums"]["analytic_point_category"];
          description?: string;
          id?: number;
          score?: number;
          text_found?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "analytic_points_analytic_id_fkey";
            columns: ["analytic_id"];
            isOneToOne: false;
            referencedRelation: "analytics";
            referencedColumns: ["id"];
          },
        ];
      };
      analytic_rooms: {
        Row: {
          analytic_status: Database["public"]["Enums"]["analytic_status_type"];
          created_at: string;
          error_msg: string | null;
          id: number;
          manual_text: string | null;
          title: string | null;
          url: string;
          user_id: string;
        };
        Insert: {
          analytic_status?: Database["public"]["Enums"]["analytic_status_type"];
          created_at?: string;
          error_msg?: string | null;
          id?: number;
          manual_text?: string | null;
          title?: string | null;
          url: string;
          user_id: string;
        };
        Update: {
          analytic_status?: Database["public"]["Enums"]["analytic_status_type"];
          created_at?: string;
          error_msg?: string | null;
          id?: number;
          manual_text?: string | null;
          title?: string | null;
          url?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics: {
        Row: {
          china_data_processing_details: string | null;
          created_at: string;
          document_type: Database["public"]["Enums"]["analytic_document_type"];
          id: number;
          room_id: number;
          score: number;
          score_category: Database["public"]["Enums"]["score_category"];
          summary: string;
          user_id: string;
        };
        Insert: {
          china_data_processing_details?: string | null;
          created_at?: string;
          document_type?: Database["public"]["Enums"]["analytic_document_type"];
          id?: number;
          room_id: number;
          score?: number;
          score_category: Database["public"]["Enums"]["score_category"];
          summary: string;
          user_id: string;
        };
        Update: {
          china_data_processing_details?: string | null;
          created_at?: string;
          document_type?: Database["public"]["Enums"]["analytic_document_type"];
          id?: number;
          room_id?: number;
          score?: number;
          score_category?: Database["public"]["Enums"]["score_category"];
          summary?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "analytics_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: true;
            referencedRelation: "analytic_rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      banned_emails: {
        Row: {
          banned_at: string;
          email: string;
          id: number;
        };
        Insert: {
          banned_at?: string;
          email: string;
          id?: number;
        };
        Update: {
          banned_at?: string;
          email?: string;
          id?: number;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          category_id: Database["public"]["Enums"]["analytic_point_category"];
          id: number;
          title: string;
        };
        Insert: {
          category_id: Database["public"]["Enums"]["analytic_point_category"];
          id?: number;
          title: string;
        };
        Update: {
          category_id?: Database["public"]["Enums"]["analytic_point_category"];
          id?: number;
          title?: string;
        };
        Relationships: [];
      };
      criteria: {
        Row: {
          case_id: number;
          category_id: number;
          id: number;
          title: string;
        };
        Insert: {
          case_id: number;
          category_id: number;
          id?: number;
          title: string;
        };
        Update: {
          case_id?: number;
          category_id?: number;
          id?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "criteria_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      deletion_survey: {
        Row: {
          created_at: string;
          email: string;
          id: number;
          other_reason: string | null;
          reasons: Database["public"]["Enums"]["deletion_survey_reason"][];
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: number;
          other_reason?: string | null;
          reasons?: Database["public"]["Enums"]["deletion_survey_reason"][];
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: number;
          other_reason?: string | null;
          reasons?: Database["public"]["Enums"]["deletion_survey_reason"][];
        };
        Relationships: [];
      };
      keep_alive: {
        Row: {
          id: number;
          random_text: string | null;
        };
        Insert: {
          id?: number;
          random_text?: string | null;
        };
        Update: {
          id?: number;
          random_text?: string | null;
        };
        Relationships: [];
      };
      usage_logs: {
        Row: {
          created_at: string;
          id: number;
          is_paid: boolean | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_paid?: boolean | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_paid?: boolean | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      analytic_document_type: "terms" | "privacy" | "unknown";
      analytic_point_category:
        | "tc_clarity"
        | "user_rights"
        | "ugc"
        | "payment"
        | "tc_changes"
        | "disputes"
        | "liability"
        | "pp_clarity"
        | "collection"
        | "usage"
        | "sharing"
        | "user_control"
        | "security"
        | "pp_changes"
        | "children";
      analytic_status_type: "idle" | "error" | "completed";
      deletion_survey_reason:
        | "not-useful"
        | "hard-to-use"
        | "found-alternative"
        | "privacy-concerns"
        | "too-many-emails"
        | "other";
      score_category:
        | "excellent"
        | "good"
        | "neutral"
        | "concerning_minor"
        | "concerning_major"
        | "potentially_harmful"
        | "incomplete_potentially_risky";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      analytic_document_type: ["terms", "privacy", "unknown"],
      analytic_point_category: [
        "tc_clarity",
        "user_rights",
        "ugc",
        "payment",
        "tc_changes",
        "disputes",
        "liability",
        "pp_clarity",
        "collection",
        "usage",
        "sharing",
        "user_control",
        "security",
        "pp_changes",
        "children",
      ],
      analytic_status_type: ["idle", "error", "completed"],
      deletion_survey_reason: [
        "not-useful",
        "hard-to-use",
        "found-alternative",
        "privacy-concerns",
        "too-many-emails",
        "other",
      ],
      score_category: [
        "excellent",
        "good",
        "neutral",
        "concerning_minor",
        "concerning_major",
        "potentially_harmful",
        "incomplete_potentially_risky",
      ],
    },
  },
} as const;
