export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          extra_permissions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          email: string
          role?: string
          extra_permissions?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          extra_permissions?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          label: string
          description: string
          color: string
          permissions: string[]
          locked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          label: string
          description?: string
          color?: string
          permissions?: string[]
          locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          label?: string
          description?: string
          color?: string
          permissions?: string[]
          locked?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: string
          name: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          country_id: string
          name: string
          bg_color: string
          text_color: string
          cover_image: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          country_id: string
          name: string
          bg_color?: string
          text_color?: string
          cover_image?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          country_id?: string
          name?: string
          bg_color?: string
          text_color?: string
          cover_image?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_sections: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          type: string
          content: string | null
          color: string
          sort_order: number
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string
          type?: string
          content?: string | null
          color?: string
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string
          type?: string
          content?: string | null
          color?: string
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
