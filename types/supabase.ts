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
      claims: {
        Row: {
          claim_id: string;
          claimant_user_id: string | null;
          claimed_at: string | null;
          deadline: string | null;
          description: string;
          is_resolved: boolean | null;
          post_id: string;
          resolved_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          claim_id?: string;
          claimant_user_id?: string | null;
          claimed_at?: string | null;
          deadline?: string | null;
          description: string;
          is_resolved?: boolean | null;
          post_id: string;
          resolved_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          claim_id?: string;
          claimant_user_id?: string | null;
          claimed_at?: string | null;
          deadline?: string | null;
          description?: string;
          is_resolved?: boolean | null;
          post_id?: string;
          resolved_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "claims_claimant_user_id_fkey";
            columns: ["claimant_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "claims_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["post_id"];
          },
        ];
      };
      comments: {
        Row: {
          comment_id: string;
          created_at: string;
          description: string | null;
          post_id: string | null;
          status: Database["public"]["Enums"]["comment_type"] | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          comment_id?: string;
          created_at?: string;
          description?: string | null;
          post_id?: string | null;
          status?: Database["public"]["Enums"]["comment_type"] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          comment_id?: string;
          created_at?: string;
          description?: string | null;
          post_id?: string | null;
          status?: Database["public"]["Enums"]["comment_type"] | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["post_id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      payments_allocation: {
        Row: {
          allocation_id: string;
          amount: number;
          created_at: string | null;
          post_id: string | null;
          user_id: string | null;
        };
        Insert: {
          allocation_id?: string;
          amount: number;
          created_at?: string | null;
          post_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          allocation_id?: string;
          amount?: number;
          created_at?: string | null;
          post_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_allocation_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["post_id"];
          },
          {
            foreignKeyName: "payments_allocation_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      payments_claim_withdrawal: {
        Row: {
          amount: number;
          claim_id: string | null;
          created_at: string | null;
          status: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id: string | null;
          user_id: string | null;
          withdrawal_id: string;
        };
        Insert: {
          amount: number;
          claim_id?: string | null;
          created_at?: string | null;
          status?: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id?: string | null;
          user_id?: string | null;
          withdrawal_id?: string;
        };
        Update: {
          amount?: number;
          claim_id?: string | null;
          created_at?: string | null;
          status?: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id?: string | null;
          user_id?: string | null;
          withdrawal_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_claim_withdrawal_claim_id_fkey";
            columns: ["claim_id"];
            isOneToOne: false;
            referencedRelation: "claims";
            referencedColumns: ["claim_id"];
          },
          {
            foreignKeyName: "payments_claim_withdrawal_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      payments_deposit: {
        Row: {
          amount: number;
          created_at: string | null;
          deposit_id: string;
          status: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id: string | null;
          user_id: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          deposit_id?: string;
          status?: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id?: string | null;
          user_id?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          deposit_id?: string;
          status?: Database["public"]["Enums"]["status_type"] | null;
          stripe_payment_id?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          amount: number | null;
          created_at: string | null;
          deadline: string | null;
          description: string | null;
          owner_user_id: string | null;
          post_id: string;
          post_type: Database["public"]["Enums"]["post_type"] | null;
          status: Database["public"]["Enums"]["status_type"] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          created_at?: string | null;
          deadline?: string | null;
          description?: string | null;
          owner_user_id?: string | null;
          post_id?: string;
          post_type?: Database["public"]["Enums"]["post_type"] | null;
          status?: Database["public"]["Enums"]["status_type"] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          created_at?: string | null;
          deadline?: string | null;
          description?: string | null;
          owner_user_id?: string | null;
          post_id?: string;
          post_type?: Database["public"]["Enums"]["post_type"] | null;
          status?: Database["public"]["Enums"]["status_type"] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_owner_user_id_fkey";
            columns: ["owner_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["user_id"];
          },
        ];
      };
      profiles: {
        Row: {
          balance: number | null;
          balance_gained: number;
          balance_offered: number;
          balance_paid: number;
          bio: string | null;
          created_at: string;
          display_name: string | null;
          email: string | null;
          lw_username: string | null;
          profile_image_url: string | null;
          stripe_account_id: string | null;
          update_at: string | null;
          user_id: string;
        };
        Insert: {
          balance?: number | null;
          balance_gained?: number;
          balance_offered?: number;
          balance_paid?: number;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          lw_username?: string | null;
          profile_image_url?: string | null;
          stripe_account_id?: string | null;
          update_at?: string | null;
          user_id: string;
        };
        Update: {
          balance?: number | null;
          balance_gained?: number;
          balance_offered?: number;
          balance_paid?: number;
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          lw_username?: string | null;
          profile_image_url?: string | null;
          stripe_account_id?: string | null;
          update_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          id: number;
          post_id: string | null;
          tag: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          post_id?: string | null;
          tag?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          post_id?: string | null;
          tag?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["post_id"];
          },
        ];
      };
      users: {
        Row: {
          balance: number;
          bio: string | null;
          created_at: string | null;
          display_name: string;
          email: string;
          lw_username: string;
          profile_image_url: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          balance?: number;
          bio?: string | null;
          created_at?: string | null;
          display_name: string;
          email: string;
          lw_username: string;
          profile_image_url?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          balance?: number;
          bio?: string | null;
          created_at?: string | null;
          display_name?: string;
          email?: string;
          lw_username?: string;
          profile_image_url?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      resolve_claim: {
        Args: {
          poster_user_id: string;
          claimant_user_id: string;
          resolving_claim_id: string;
          award: number;
        };
        Returns: undefined;
      };
    };
    Enums: {
      comment_type: "public" | "hidden" | "deleted";
      post_type: "bounty" | "dac";
      status_type: "unclaimed" | "claimed" | "finished";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
