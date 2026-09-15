export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: 'client' | 'trainer' | 'admin';
          created_at: string;
          updated_at: string;
          onboarding_completed: boolean;
          preferences: Json | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'client' | 'trainer' | 'admin';
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'client' | 'trainer' | 'admin';
          created_at?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          preferences?: Json | null;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          exercises: Json;
          duration_minutes: number | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          exercises: Json;
          duration_minutes?: number | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          exercises?: Json;
          duration_minutes?: number | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          created_at?: string;
          updated_at?: string;
        };
      };
      nutrition_logs: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meals: Json;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meals: Json;
          total_calories: number;
          total_protein: number;
          total_carbs: number;
          total_fat: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meals?: Json;
          total_calories?: number;
          total_protein?: number;
          total_carbs?: number;
          total_fat?: number;
          notes?: string | null;
          created_at?: string;
        };
      };
      progress_photos: {
        Row: {
          id: string;
          user_id: string;
          photo_url: string;
          thumbnail_url: string | null;
          taken_at: string;
          notes: string | null;
          body_weight: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          photo_url: string;
          thumbnail_url?: string | null;
          taken_at: string;
          notes?: string | null;
          body_weight?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          photo_url?: string;
          thumbnail_url?: string | null;
          taken_at?: string;
          notes?: string | null;
          body_weight?: number | null;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          client_id: string;
          trainer_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          trainer_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          trainer_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
