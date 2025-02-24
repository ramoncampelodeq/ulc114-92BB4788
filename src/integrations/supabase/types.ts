export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          brother_id: string | null
          created_at: string | null
          id: string
          present: boolean
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          brother_id?: string | null
          created_at?: string | null
          id?: string
          present?: boolean
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          brother_id?: string | null
          created_at?: string | null
          id?: string
          present?: boolean
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "brothers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "critical_overdue_brothers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      brothers: {
        Row: {
          birth_date: string
          created_at: string | null
          degree: string
          email: string
          higher_degree: number | null
          id: string
          name: string
          phone: string
          profession: string
          user_id: string | null
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          degree: string
          email?: string
          higher_degree?: number | null
          id?: string
          name: string
          phone?: string
          profession: string
          user_id?: string | null
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          degree?: string
          email?: string
          higher_degree?: number | null
          id?: string
          name?: string
          phone?: string
          profession?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cash_movements: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["cash_movement_category"]
          created_at: string
          description: string | null
          id: string
          is_recurring: boolean | null
          month: number
          type: Database["public"]["Enums"]["cash_movement_type"]
          user_id: string | null
          year: number
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["cash_movement_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          month: number
          type: Database["public"]["Enums"]["cash_movement_type"]
          user_id?: string | null
          year: number
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["cash_movement_category"]
          created_at?: string
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          month?: number
          type?: Database["public"]["Enums"]["cash_movement_type"]
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
      monthly_dues: {
        Row: {
          amount: number
          brother_id: string | null
          created_at: string | null
          due_date: string
          id: string
          month: number
          paid_at: string | null
          status: string
          year: number
        }
        Insert: {
          amount: number
          brother_id?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          month: number
          paid_at?: string | null
          status?: string
          year: number
        }
        Update: {
          amount?: number
          brother_id?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          month?: number
          paid_at?: string | null
          status?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_dues_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "brothers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_dues_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "critical_overdue_brothers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      relatives: {
        Row: {
          birth_date: string
          brother_id: string | null
          created_at: string | null
          id: string
          name: string
          relationship: string
        }
        Insert: {
          birth_date: string
          brother_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          relationship: string
        }
        Update: {
          birth_date?: string
          brother_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "relatives_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "brothers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "relatives_brother_id_fkey"
            columns: ["brother_id"]
            isOneToOne: false
            referencedRelation: "critical_overdue_brothers"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          agenda: string
          created_at: string | null
          daily_trunk_amount: number | null
          date: string
          degree: string
          id: string
          minutes_url: string | null
          time: string
          type: string
          user_id: string | null
        }
        Insert: {
          agenda: string
          created_at?: string | null
          daily_trunk_amount?: number | null
          date: string
          degree: string
          id?: string
          minutes_url?: string | null
          time: string
          type?: string
          user_id?: string | null
        }
        Update: {
          agenda?: string
          created_at?: string | null
          daily_trunk_amount?: number | null
          date?: string
          degree?: string
          id?: string
          minutes_url?: string | null
          time?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      cash_balance: {
        Row: {
          expenses_total: number | null
          month: number | null
          monthly_fees_total: number | null
          other_income_total: number | null
          solidarity_trunk_total: number | null
          total_balance: number | null
          year: number | null
        }
        Relationships: []
      }
      critical_overdue_brothers: {
        Row: {
          id: string | null
          latest_due_date: string | null
          name: string | null
          overdue_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      copy_recurring_movements: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      cash_movement_category:
        | "monthly_fee"
        | "solidarity_trunk"
        | "other_income"
        | "expense"
      cash_movement_type: "income" | "expense"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
