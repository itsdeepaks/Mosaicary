export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/**
 * Placeholder generated-type contract for Slice 10.1a.
 *
 * Replace this file with `supabase gen types typescript` output only after a
 * Tessli Supabase project and reviewed database schema exist. An empty schema
 * is more truthful than inventing tables before Slice 11.1.
 */
export type Database = {
  public: {
    Tables: { [_ in never]: never };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
