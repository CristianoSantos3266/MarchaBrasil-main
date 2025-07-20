export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          public_name: string | null
          state: string | null
          city: string | null
          whatsapp: string | null
          motivation: string | null
          social_link: string | null
          role: 'user' | 'organizer-pending' | 'organizer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          public_name?: string | null
          state?: string | null
          city?: string | null
          whatsapp?: string | null
          motivation?: string | null
          social_link?: string | null
          role?: 'user' | 'organizer-pending' | 'organizer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          public_name?: string | null
          state?: string | null
          city?: string | null
          whatsapp?: string | null
          motivation?: string | null
          social_link?: string | null
          role?: 'user' | 'organizer-pending' | 'organizer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          creator_id: string
          title: string
          type: 'caminhada' | 'caminhoneiros' | 'carreata' | 'motociata' | 'vigilia'
          state: string
          city: string
          meeting_point: string
          final_destination: string | null
          date: string
          time: string
          description: string
          expected_attendance: number | null
          whatsapp_contact: string
          status: 'pending' | 'approved' | 'rejected'
          rejection_reason: string | null
          is_international: boolean
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title: string
          type: 'caminhada' | 'caminhoneiros' | 'carreata' | 'motociata' | 'vigilia'
          state: string
          city: string
          meeting_point: string
          final_destination?: string | null
          date: string
          time: string
          description: string
          expected_attendance?: number | null
          whatsapp_contact: string
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          is_international?: boolean
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string
          type?: 'caminhada' | 'caminhoneiros' | 'carreata' | 'motociata' | 'vigilia'
          state?: string
          city?: string
          meeting_point?: string
          final_destination?: string | null
          date?: string
          time?: string
          description?: string
          expected_attendance?: number | null
          whatsapp_contact?: string
          status?: 'pending' | 'approved' | 'rejected'
          rejection_reason?: string | null
          is_international?: boolean
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_participants: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          participant_type: 'caminhoneiro' | 'motociclista' | 'cidadao'
          anonymous_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          participant_type: 'caminhoneiro' | 'motociclista' | 'cidadao'
          anonymous_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          participant_type?: 'caminhoneiro' | 'motociclista' | 'cidadao'
          anonymous_id?: string | null
          created_at?: string
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
      user_role: 'user' | 'organizer-pending' | 'organizer' | 'admin'
      event_status: 'pending' | 'approved' | 'rejected'
      event_type: 'caminhada' | 'caminhoneiros' | 'carreata' | 'motociata' | 'vigilia'
      participant_type: 'caminhoneiro' | 'motociclista' | 'cidadao'
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Event = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']

export type EventParticipant = Database['public']['Tables']['event_participants']['Row']
export type EventParticipantInsert = Database['public']['Tables']['event_participants']['Insert']

export type UserRole = Database['public']['Enums']['user_role']
export type EventStatus = Database['public']['Enums']['event_status']
export type EventType = Database['public']['Enums']['event_type']
export type ParticipantType = Database['public']['Enums']['participant_type']