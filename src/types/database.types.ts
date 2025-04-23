export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      analytic_points: {
        Row: {
          analytic_id: number;
          case_id: number;
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id: number;
          importance: Database["public"]["Enums"]["analytic_point_importance"];
          rating: Database["public"]["Enums"]["analytic_point_rating"];
        };
        Insert: {
          analytic_id: number;
          case_id: number;
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id?: number;
          importance: Database["public"]["Enums"]["analytic_point_importance"];
          rating: Database["public"]["Enums"]["analytic_point_rating"];
        };
        Update: {
          analytic_id?: number;
          case_id?: number;
          category?: Database["public"]["Enums"]["analytic_point_category"];
          description?: string;
          id?: number;
          importance?: Database["public"]["Enums"]["analytic_point_importance"];
          rating?: Database["public"]["Enums"]["analytic_point_rating"];
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
          id: number;
          url: string;
          user_id: string;
        };
        Insert: {
          analytic_status?: Database["public"]["Enums"]["analytic_status_type"];
          created_at?: string;
          id?: number;
          url: string;
          user_id: string;
        };
        Update: {
          analytic_status?: Database["public"]["Enums"]["analytic_status_type"];
          created_at?: string;
          id?: number;
          url?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      analytics: {
        Row: {
          created_at: string;
          id: number;
          room_id: number;
          score: number;
          triggered_geopolitical_risk: boolean;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          room_id: number;
          score: number;
          triggered_geopolitical_risk?: boolean;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          room_id?: number;
          score?: number;
          triggered_geopolitical_risk?: boolean;
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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      analytic_point_category:
        | "privacy"
        | "transparency"
        | "rights"
        | "security"
        | "geopolitical_risk";
      analytic_point_importance: "minor" | "major" | "critical";
      analytic_point_rating: "good" | "bad" | "neutral";
      analytic_status_type: "idle" | "error" | "completed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      analytic_point_category: [
        "privacy",
        "transparency",
        "rights",
        "security",
        "geopolitical_risk",
      ],
      analytic_point_importance: ["minor", "major", "critical"],
      analytic_point_rating: ["good", "bad", "neutral"],
      analytic_status_type: ["idle", "error", "completed"],
    },
  },
} as const;
