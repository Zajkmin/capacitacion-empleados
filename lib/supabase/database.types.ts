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
      project_groups: {
        Row: {
          id: string
          name: string
          type: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          group_id: string
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
          group_id: string
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
          group_id?: string
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
      project_assignments: {
        Row: {
          user_id: string
          project_id: string
          assigned_by: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          project_id: string
          assigned_by?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          project_id?: string
          assigned_by?: string | null
          created_at?: string
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
      section_items: {
        Row: {
          id: string
          section_id: string
          type: string
          title: string
          description: string
          content: string | null
          image_url: string | null
          source_url: string | null
          metadata: Json
          sort_order: number
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          type: string
          title: string
          description?: string
          content?: string | null
          image_url?: string | null
          source_url?: string | null
          metadata?: Json
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          type?: string
          title?: string
          description?: string
          content?: string | null
          image_url?: string | null
          source_url?: string | null
          metadata?: Json
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_topics: {
        Row: {
          id: string
          title: string
          category: string
          summary: string
          body: string
          content_type: string
          media_url: string | null
          visible_to: string[]
          sort_order: number
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          category?: string
          summary?: string
          body?: string
          content_type?: string
          media_url?: string | null
          visible_to?: string[]
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          summary?: string
          body?: string
          content_type?: string
          media_url?: string | null
          visible_to?: string[]
          sort_order?: number
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      activity_events: {
        Row: {
          id: string
          project_id: string | null
          section_id: string | null
          item_id: string | null
          actor_id: string | null
          action: string
          item_type: string
          title: string
          description: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          section_id?: string | null
          item_id?: string | null
          actor_id?: string | null
          action: string
          item_type: string
          title: string
          description?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          section_id?: string | null
          item_id?: string | null
          actor_id?: string | null
          action?: string
          item_type?: string
          title?: string
          description?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          user_id: string
          seen_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          seen_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          seen_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      update_own_profile_name: {
        Args: {
          new_name: string
        }
        Returns: {
          id: string
          name: string
          email: string
          role: string
          extra_permissions: string[]
          created_at: string
        }[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
