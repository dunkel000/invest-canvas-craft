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
      asset_universe: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          country: string | null
          created_at: string
          current_price: number | null
          description: string | null
          exchange: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          market_cap: number | null
          metadata: Json | null
          name: string
          sector: string | null
          source: string
          source_id: string | null
          symbol: string
          updated_at: string
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          country?: string | null
          created_at?: string
          current_price?: number | null
          description?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          market_cap?: number | null
          metadata?: Json | null
          name: string
          sector?: string | null
          source?: string
          source_id?: string | null
          symbol: string
          updated_at?: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          country?: string | null
          created_at?: string
          current_price?: number | null
          description?: string | null
          exchange?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          market_cap?: number | null
          metadata?: Json | null
          name?: string
          sector?: string | null
          source?: string
          source_id?: string | null
          symbol?: string
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          allocation_percentage: number | null
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
          target_allocation_percentage: number | null
          total_value: number | null
          universe_asset_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allocation_percentage?: number | null
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
          target_allocation_percentage?: number | null
          total_value?: number | null
          universe_asset_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allocation_percentage?: number | null
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
          target_allocation_percentage?: number | null
          total_value?: number | null
          universe_asset_id?: string | null
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
          {
            foreignKeyName: "assets_universe_asset_id_fkey"
            columns: ["universe_asset_id"]
            isOneToOne: false
            referencedRelation: "asset_universe"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
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
      module_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_performance: {
        Row: {
          created_at: string
          daily_return: number | null
          daily_return_percentage: number | null
          date: string
          id: string
          portfolio_id: string
          total_value: number
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_return?: number | null
          daily_return_percentage?: number | null
          date?: string
          id?: string
          portfolio_id: string
          total_value?: number
          user_id: string
        }
        Update: {
          created_at?: string
          daily_return?: number | null
          daily_return_percentage?: number | null
          date?: string
          id?: string
          portfolio_id?: string
          total_value?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_performance_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
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
      role_module_permissions: {
        Row: {
          created_at: string
          id: string
          is_enabled: boolean | null
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          module_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_enabled?: boolean | null
          module_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      system_modules: {
        Row: {
          category: string
          created_at: string
          description: string | null
          icon: string
          id: string
          is_active: boolean | null
          min_role: Database["public"]["Enums"]["app_role"]
          module_id: string
          name: string
          path: string
          requires_subscription: boolean | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          min_role?: Database["public"]["Enums"]["app_role"]
          module_id: string
          name: string
          path: string
          requires_subscription?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          min_role?: Database["public"]["Enums"]["app_role"]
          module_id?: string
          name?: string
          path?: string
          requires_subscription?: boolean | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
      assign_role_to_user: {
        Args: {
          _user_email: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      check_module_permission: {
        Args: { _user_id: string; _module_id: string }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_accessible_modules: {
        Args: { _user_id: string }
        Returns: {
          module_id: string
          name: string
          path: string
          icon: string
          category: string
          description: string
          sort_order: number
        }[]
      }
      get_user_statistics: {
        Args: { _user_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_admin_action: {
        Args: { _action: string; _target_user_id?: string; _details?: Json }
        Returns: string
      }
      promote_to_admin: {
        Args: { _user_email: string }
        Returns: boolean
      }
      remove_role_from_user: {
        Args: {
          _user_email: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      update_role_module_permission: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _module_id: string
          _enabled: boolean
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "user"
        | "manager"
        | "investment_professional"
        | "premium_user"
        | "standard_user"
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
      app_role: [
        "admin",
        "user",
        "manager",
        "investment_professional",
        "premium_user",
        "standard_user",
      ],
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
