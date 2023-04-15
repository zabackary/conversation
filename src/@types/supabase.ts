export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      channels: {
        Row: {
          auto_join: boolean
          created_at: string | null
          description: string | null
          id: number
          is_dm: boolean
          name: string | null
          owner: string
          password: string | null
          privacy_level: number
        }
        Insert: {
          auto_join?: boolean
          created_at?: string | null
          description?: string | null
          id?: number
          is_dm: boolean
          name?: string | null
          owner: string
          password?: string | null
          privacy_level: number
        }
        Update: {
          auto_join?: boolean
          created_at?: string | null
          description?: string | null
          id?: number
          is_dm?: boolean
          name?: string | null
          owner?: string
          password?: string | null
          privacy_level?: number
        }
      }
      members: {
        Row: {
          accepted: boolean
          channel_id: number
          invite_message: string | null
          last_view: string | null
          user_id: string
        }
        Insert: {
          accepted: boolean
          channel_id: number
          invite_message?: string | null
          last_view?: string | null
          user_id: string
        }
        Update: {
          accepted?: boolean
          channel_id?: number
          invite_message?: string | null
          last_view?: string | null
          user_id?: string
        }
      }
      messages: {
        Row: {
          channel_id: number
          id: number
          markdown: string
          replying_to: number | null
          rich: Json | null
          sent_at: string
          user_id: string
        }
        Insert: {
          channel_id: number
          id?: never
          markdown: string
          replying_to?: number | null
          rich?: Json | null
          sent_at?: string
          user_id: string
        }
        Update: {
          channel_id?: number
          id?: never
          markdown?: string
          replying_to?: number | null
          rich?: Json | null
          sent_at?: string
          user_id?: string
        }
      }
      users: {
        Row: {
          banner_url: string | null
          id: string
          is_bot: boolean
          name: string
          nickname: string
          profile_picture_url: string | null
          trusted: boolean
        }
        Insert: {
          banner_url?: string | null
          id: string
          is_bot: boolean
          name: string
          nickname: string
          profile_picture_url?: string | null
          trusted: boolean
        }
        Update: {
          banner_url?: string | null
          id?: string
          is_bot?: boolean
          name?: string
          nickname?: string
          profile_picture_url?: string | null
          trusted?: boolean
        }
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
