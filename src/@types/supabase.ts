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
      attachments: {
        Row: {
          as_image: boolean
          created_at: string | null
          has_error: boolean
          id: string
          last_modified: string
          message_id: number
          mime_type: string
          name: string
          upload_url: string | null
        }
        Insert: {
          as_image?: boolean
          created_at?: string | null
          has_error?: boolean
          id?: string
          last_modified: string
          message_id: number
          mime_type: string
          name: string
          upload_url?: string | null
        }
        Update: {
          as_image?: boolean
          created_at?: string | null
          has_error?: boolean
          id?: string
          last_modified?: string
          message_id?: number
          mime_type?: string
          name?: string
          upload_url?: string | null
        }
      }
      channels: {
        Row: {
          auto_join: boolean
          created_at: string | null
          description: string | null
          id: number
          is_dm: boolean
          members_can_edit: boolean
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
          members_can_edit?: boolean
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
          members_can_edit?: boolean
          name?: string | null
          owner?: string
          password?: string | null
          privacy_level?: number
        }
      }
      members: {
        Row: {
          accepted: boolean
          actor: string | null
          channel_id: number
          invite_message: string | null
          last_view: string
          user_id: string
        }
        Insert: {
          accepted: boolean
          actor?: string | null
          channel_id: number
          invite_message?: string | null
          last_view?: string
          user_id: string
        }
        Update: {
          accepted?: boolean
          actor?: string | null
          channel_id?: number
          invite_message?: string | null
          last_view?: string
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
          user_id: string | null
        }
        Insert: {
          channel_id: number
          id?: never
          markdown: string
          replying_to?: number | null
          rich?: Json | null
          sent_at?: string
          user_id?: string | null
        }
        Update: {
          channel_id?: number
          id?: never
          markdown?: string
          replying_to?: number | null
          rich?: Json | null
          sent_at?: string
          user_id?: string | null
        }
      }
      users: {
        Row: {
          admin: boolean
          banner_url: string | null
          bot_webhook: string | null
          disabled: boolean
          email: string | null
          id: string
          is_bot: boolean
          name: string
          nickname: string
          profile_picture_url: string | null
          verified: boolean
        }
        Insert: {
          admin?: boolean
          banner_url?: string | null
          bot_webhook?: string | null
          disabled?: boolean
          email?: string | null
          id: string
          is_bot: boolean
          name: string
          nickname: string
          profile_picture_url?: string | null
          verified: boolean
        }
        Update: {
          admin?: boolean
          banner_url?: string | null
          bot_webhook?: string | null
          disabled?: boolean
          email?: string | null
          id?: string
          is_bot?: boolean
          name?: string
          nickname?: string
          profile_picture_url?: string | null
          verified?: boolean
        }
      }
    }
    Views: {
      joined_channels: {
        Row: {
          channel_id: number | null
        }
        Insert: {
          channel_id?: number | null
        }
        Update: {
          channel_id?: number | null
        }
      }
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
