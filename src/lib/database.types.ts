export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'citizen' | 'admin';
          display_name: string;
          avatar_url: string;
          location: string;
          bio: string;
          badge: string;
          contributions_count: number;
          reviews_count: number;
          saved_places_count: number;
          reputation_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
        Relationships: [];
      };
      app_records: {
        Row: {
          id: string;
          entity_type: 'venues' | 'contributions' | 'community_posts' | 'rejected_posts' | 'saved_lists' | 'notifications' | 'reports';
          record_id: string;
          owner_id: string | null;
          payload: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          entity_type: Database['public']['Tables']['app_records']['Row']['entity_type'];
          record_id: string;
          owner_id?: string | null;
          payload: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['app_records']['Insert']>;
        Relationships: [];
      };
      community_post_reactions: {
        Row: {
          post_id: string;
          user_id: string;
          reaction: 'like' | 'dislike';
          created_at: string;
        };
        Insert: {
          post_id: string;
          user_id: string;
          reaction: 'like' | 'dislike';
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_post_reactions']['Insert']>;
        Relationships: [];
      };
      community_post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          post_id: string;
          user_id: string;
          payload: Json;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['community_post_comments']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      moderate_community_post: {
        Args: { p_record_id: string; p_status: 'Verified' | 'Rejected' };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
