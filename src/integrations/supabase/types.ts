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
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_queue: {
        Row: {
          created_at: string
          id: string
          locked_at: string | null
          locked_by: string | null
          property_id: string
          result: Json | null
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          property_id: string
          result?: Json | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          locked_at?: string | null
          locked_by?: string | null
          property_id?: string
          result?: Json | null
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_queue_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_queue_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "property_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          agent_name: string | null
          agent_phone: string | null
          agent_whatsapp: string | null
          area_sq_m: number | null
          balcony: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: string | null
          created_at: string
          currency: string | null
          description: string | null
          elevator: boolean | null
          features: string[] | null
          floor_number: number | null
          furnished: boolean | null
          garden: boolean | null
          gym: boolean | null
          id: string
          latitude: number | null
          listing_type: string | null
          location: string | null
          longitude: number | null
          nearby_places: string[] | null
          parking: number | null
          pool: boolean | null
          price: number | null
          property_type: string | null
          security: boolean | null
          source_row: Json | null
          title: string | null
          total_floors: number | null
          updated_at: string
          year_built: number | null
        }
        Insert: {
          agent_name?: string | null
          agent_phone?: string | null
          agent_whatsapp?: string | null
          area_sq_m?: number | null
          balcony?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          elevator?: boolean | null
          features?: string[] | null
          floor_number?: number | null
          furnished?: boolean | null
          garden?: boolean | null
          gym?: boolean | null
          id?: string
          latitude?: number | null
          listing_type?: string | null
          location?: string | null
          longitude?: number | null
          nearby_places?: string[] | null
          parking?: number | null
          pool?: boolean | null
          price?: number | null
          property_type?: string | null
          security?: boolean | null
          source_row?: Json | null
          title?: string | null
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          agent_name?: string | null
          agent_phone?: string | null
          agent_whatsapp?: string | null
          area_sq_m?: number | null
          balcony?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          elevator?: boolean | null
          features?: string[] | null
          floor_number?: number | null
          furnished?: boolean | null
          garden?: boolean | null
          gym?: boolean | null
          id?: string
          latitude?: number | null
          listing_type?: string | null
          location?: string | null
          longitude?: number | null
          nearby_places?: string[] | null
          parking?: number | null
          pool?: boolean | null
          price?: number | null
          property_type?: string | null
          security?: boolean | null
          source_row?: Json | null
          title?: string | null
          total_floors?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          order: number | null
          path: string
          property_id: string
          public_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order?: number | null
          path: string
          property_id: string
          public_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order?: number | null
          path?: string
          property_id?: string
          public_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          property_id: string
          selected: boolean | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          property_id: string
          selected?: boolean | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          property_id?: string
          selected?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_templates_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_visits: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          property_id: string
          referrer: string | null
          user_agent: string | null
          user_email: string | null
          user_name: string | null
          visit_timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          property_id: string
          referrer?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_name?: string | null
          visit_timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          property_id?: string
          referrer?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_name?: string | null
          visit_timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_visits_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_wishlist: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_email: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wishlist_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          password_hash: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password_hash: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password_hash?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_login: {
        Args: { p_email: string; p_password: string }
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
        }[]
      }
      user_register: {
        Args: {
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_password: string
          p_phone?: string
        }
        Returns: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
        }[]
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
