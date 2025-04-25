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
          case_id: Database["public"]["Enums"]["analytic_point_case_id"];
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id: number;
          score: number;
        };
        Insert: {
          analytic_id: number;
          case_id: Database["public"]["Enums"]["analytic_point_case_id"];
          category: Database["public"]["Enums"]["analytic_point_category"];
          description: string;
          id?: number;
          score: number;
        };
        Update: {
          analytic_id?: number;
          case_id?: Database["public"]["Enums"]["analytic_point_case_id"];
          category?: Database["public"]["Enums"]["analytic_point_category"];
          description?: string;
          id?: number;
          score?: number;
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
          china_data_processing_details: string | null;
          created_at: string;
          document_type: Database["public"]["Enums"]["analytic_document_type"];
          id: number;
          room_id: number;
          score: number;
          user_id: string;
        };
        Insert: {
          china_data_processing_details?: string | null;
          created_at?: string;
          document_type: Database["public"]["Enums"]["analytic_document_type"];
          id?: number;
          room_id: number;
          score: number;
          user_id: string;
        };
        Update: {
          china_data_processing_details?: string | null;
          created_at?: string;
          document_type?: Database["public"]["Enums"]["analytic_document_type"];
          id?: number;
          room_id?: number;
          score?: number;
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
      analytic_document_type: "terms" | "privacy" | "unknown";
      analytic_point_case_id:
        | "1.1"
        | "1.2"
        | "1.3"
        | "2.1"
        | "2.2"
        | "3.1"
        | "3.2"
        | "4.1"
        | "4.2"
        | "4.3"
        | "4.4"
        | "5.1"
        | "5.2"
        | "5.3"
        | "6.1"
        | "6.2"
        | "6.3"
        | "7.1"
        | "7.2"
        | "7.3";
      analytic_point_category:
        | "clarity"
        | "user_rights"
        | "ugc"
        | "payment"
        | "changes"
        | "disputes"
        | "liability";
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
      analytic_document_type: ["terms", "privacy", "unknown"],
      analytic_point_case_id: [
        "1.1",
        "1.2",
        "1.3",
        "2.1",
        "2.2",
        "3.1",
        "3.2",
        "4.1",
        "4.2",
        "4.3",
        "4.4",
        "5.1",
        "5.2",
        "5.3",
        "6.1",
        "6.2",
        "6.3",
        "7.1",
        "7.2",
        "7.3",
      ],
      analytic_point_category: [
        "clarity",
        "user_rights",
        "ugc",
        "payment",
        "changes",
        "disputes",
        "liability",
      ],
      analytic_status_type: ["idle", "error", "completed"],
    },
  },
} as const;
