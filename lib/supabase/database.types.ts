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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
