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
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          rating: number;
          comment: string;
          encrypted: boolean | null;
          encryption_iv: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          rating: number;
          comment: string;
          encrypted?: boolean | null;
          encryption_iv?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          rating?: number;
          comment?: string;
          encrypted?: boolean | null;
          encryption_iv?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          average_rating: number | null;
          review_count: number | null;
        };
        Insert: {
          id?: string;
          average_rating?: number | null;
          review_count?: number | null;
        };
        Update: {
          id?: string;
          average_rating?: number | null;
          review_count?: number | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          product_id: string;
          order_id: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          order_id: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          order_id?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          is_admin: boolean | null;
        };
        Insert: {
          id: string;
          is_admin?: boolean | null;
        };
        Update: {
          id?: string;
          is_admin?: boolean | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}