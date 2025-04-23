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
      bet_history: {
        Row: {
          id: string
          user_id: string
          pool_id: string
          pool_name: string
          amount: number
          is_win: boolean
          block_height: number
          win_amount: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pool_id: string
          pool_name: string
          amount: number
          is_win: boolean
          block_height: number
          win_amount?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pool_id?: string
          pool_name?: string
          amount?: number
          is_win?: boolean
          block_height?: number
          win_amount?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bet_history_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lightning_deposits: {
        Row: {
          amount_sats: number
          created_at: string
          id: string
          payment_hash: string
          payment_request: string
          status: string
          user_id: string
        }
        Insert: {
          amount_sats: number
          created_at?: string
          id?: string
          payment_hash: string
          payment_request: string
          status?: string
          user_id: string
        }
        Update: {
          amount_sats?: number
          created_at?: string
          id?: string
          payment_hash?: string
          payment_request?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      lightning_withdrawals: {
        Row: {
          amount_sats: number
          created_at: string
          id: string
          payment_hash: string | null
          payment_request: string
          status: string
          user_id: string
        }
        Insert: {
          amount_sats: number
          created_at?: string
          id?: string
          payment_hash?: string | null
          payment_request: string
          status?: string
          user_id: string
        }
        Update: {
          amount_sats?: number
          created_at?: string
          id?: string
          payment_hash?: string | null
          payment_request?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          lnbits_admin_key: string | null
          lnbits_auth_key: string | null
          lnbits_invoice_key: string | null
          lnbits_user_id: string | null
          lnbits_wallet_id: string | null
          username: string | null
          wallet_balance: number | null
        }
        Insert: {
          created_at?: string | null
          id: string
          lnbits_admin_key?: string | null
          lnbits_auth_key?: string | null
          lnbits_invoice_key?: string | null
          lnbits_user_id?: string | null
          lnbits_wallet_id?: string | null
          username?: string | null
          wallet_balance?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lnbits_admin_key?: string | null
          lnbits_auth_key?: string | null
          lnbits_invoice_key?: string | null
          lnbits_user_id?: string | null
          lnbits_wallet_id?: string | null
          username?: string | null
          wallet_balance?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const