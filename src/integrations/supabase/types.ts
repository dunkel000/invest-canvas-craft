export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      api_connections: {
        Row: {
          api_key_encrypted: string | null
          created_at: string
          endpoint_url: string | null
          id: string
          is_active: boolean | null
          last_sync: string | null
          name: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          api_key_encrypted?: string | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          api_key_encrypted?: string | null
          created_at?: string
          endpoint_url?: string | null
          id?: string
          is_active?: boolean | null
          last_sync?: string | null
          name?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          api_connection_id: string | null
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at: string
          current_price: number | null
          id: string
          metadata: Json | null
          name: string
          portfolio_id: string
          purchase_price: number | null
          quantity: number
          risk_category: Database["public"]["Enums"]["risk_category"] | null
          symbol: string | null
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          api_connection_id?: string | null
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at?: string
          current_price?: number | null
          id?: string
          metadata?: Json | null
          name: string
          portfolio_id: string
          purchase_price?: number | null
          quantity?: number
          risk_category?: Database["public"]["Enums"]["risk_category"] | null
          symbol?: string | null
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          api_connection_id?: string | null
          asset_type?: Database["public"]["Enums"]["asset_type"]
          created_at?: string
          current_price?: number | null
          id?: string
          metadata?: Json | null
          name?: string
          portfolio_id?: string
          purchase_price?: number | null
          quantity?: number
          risk_category?: Database["public"]["Enums"]["risk_category"] | null
          symbol?: string | null
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assets_api_connection_id_fkey"
            columns: ["api_connection_id"]
            isOneToOne: false
            referencedRelation: "api_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      cashflows: {
        Row: {
          amount: number
          asset_id: string | null
          cashflow_type: Database["public"]["Enums"]["cashflow_type"]
          created_at: string
          description: string | null
          end_date: string | null
          flow_id: string | null
          frequency: string | null
          id: string
          metadata: Json | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          asset_id?: string | null
          cashflow_type: Database["public"]["Enums"]["cashflow_type"]
          created_at?: string
          description?: string | null
          end_date?: string | null
          flow_id?: string | null
          frequency?: string | null
          id?: string
          metadata?: Json | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_id?: string | null
          cashflow_type?: Database["public"]["Enums"]["cashflow_type"]
          created_at?: string
          description?: string | null
          end_date?: string | null
          flow_id?: string | null
          frequency?: string | null
          id?: string
          metadata?: Json | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cashflows_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashflows_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          created_at: string
          description: string | null
          flow_data: Json
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_data?: Json
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_data?: Json
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      math_functions: {
        Row: {
          created_at: string
          description: string | null
          flow_id: string | null
          formula: string | null
          function_type: Database["public"]["Enums"]["math_function_type"]
          id: string
          input_assets: string[] | null
          parameters: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_id?: string | null
          formula?: string | null
          function_type: Database["public"]["Enums"]["math_function_type"]
          id?: string
          input_assets?: string[] | null
          parameters?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_id?: string | null
          formula?: string | null
          function_type?: Database["public"]["Enums"]["math_function_type"]
          id?: string
          input_assets?: string[] | null
          parameters?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "math_functions_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          currency: string | null
          description: string | null
          id: string
          name: string
          total_value: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name: string
          total_value?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          name?: string
          total_value?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
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
      [_ in never]: never
    }
    Enums: {
      asset_type:
        | "stock"
        | "crypto"
        | "bond"
        | "etf"
        | "real_estate"
        | "commodity"
        | "other"
      cashflow_type:
        | "income"
        | "expense"
        | "dividend"
        | "interest"
        | "capital_gain"
        | "capital_loss"
      math_function_type:
        | "add"
        | "subtract"
        | "multiply"
        | "divide"
        | "percentage"
        | "compound"
        | "present_value"
        | "future_value"
      risk_category: "low" | "medium" | "high" | "very_high"
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
      asset_type: [
        "stock",
        "crypto",
        "bond",
        "etf",
        "real_estate",
        "commodity",
        "other",
      ],
      cashflow_type: [
        "income",
        "expense",
        "dividend",
        "interest",
        "capital_gain",
        "capital_loss",
      ],
      math_function_type: [
        "add",
        "subtract",
        "multiply",
        "divide",
        "percentage",
        "compound",
        "present_value",
        "future_value",
      ],
      risk_category: ["low", "medium", "high", "very_high"],
    },
  },
} as const
