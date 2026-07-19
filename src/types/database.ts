/** Supabase Database types for GoalCurrent v2 (matches 20260719180000_gc_v2_initial). */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MatchStatus =
  | "unknown"
  | "not_started"
  | "in_play"
  | "paused"
  | "finished"
  | "extra_time"
  | "penalties"
  | "postponed"
  | "cancelled"
  | "suspended"
  | "interrupted"
  | "abandoned"
  | "awarded"
  | "walkover";

export type BriefStatus = "draft" | "in_review" | "published" | "archived";
export type SectionType = "thesis" | "evidence" | "key_moment" | "verdict";
export type FeedbackType =
  | "learned_something"
  | "disagree"
  | "too_obvious"
  | "too_technical"
  | "too_long";
export type UserRole = "reader" | "editor" | "admin";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          role: UserRole;
          favourite_team_ids: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          role?: UserRole;
          favourite_team_ids?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          display_name?: string | null;
          role?: UserRole;
          favourite_team_ids?: number[];
          updated_at?: string;
        };
        Relationships: [];
      };
      competitions: {
        Row: {
          id: number;
          name: string;
          country: string | null;
          logo_url: string | null;
          flag_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          country?: string | null;
          logo_url?: string | null;
          flag_url?: string | null;
        };
        Update: {
          name?: string;
          country?: string | null;
          logo_url?: string | null;
          flag_url?: string | null;
        };
        Relationships: [];
      };
      teams: {
        Row: {
          id: number;
          name: string;
          logo_url: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          logo_url?: string | null;
          country?: string | null;
        };
        Update: {
          name?: string;
          logo_url?: string | null;
          country?: string | null;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          id: number;
          name: string;
          city: string | null;
          country: string | null;
          capacity: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          city?: string | null;
          country?: string | null;
          capacity?: number | null;
        };
        Update: {
          name?: string;
          city?: string | null;
          country?: string | null;
          capacity?: number | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          id: number;
          local_fixture_id: string | null;
          competition_id: number;
          season: number;
          round: string | null;
          home_team_id: number;
          away_team_id: number;
          home_team_name: string;
          away_team_name: string;
          home_team_logo: string | null;
          away_team_logo: string | null;
          venue_id: number | null;
          venue_name: string | null;
          venue_city: string | null;
          referee: string | null;
          kickoff_time: string;
          api_status_short: string | null;
          api_status_long: string | null;
          status: MatchStatus;
          elapsed_minute: number | null;
          extra_minute: number | null;
          home_score: number | null;
          away_score: number | null;
          halftime_home_score: number | null;
          halftime_away_score: number | null;
          fulltime_home_score: number | null;
          fulltime_away_score: number | null;
          extratime_home_score: number | null;
          extratime_away_score: number | null;
          penalty_home_score: number | null;
          penalty_away_score: number | null;
          winner_team_id: number | null;
          provider_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          local_fixture_id?: string | null;
          competition_id: number;
          season: number;
          round?: string | null;
          home_team_id: number;
          away_team_id: number;
          home_team_name: string;
          away_team_name: string;
          home_team_logo?: string | null;
          away_team_logo?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          venue_city?: string | null;
          referee?: string | null;
          kickoff_time: string;
          api_status_short?: string | null;
          api_status_long?: string | null;
          status?: MatchStatus;
          elapsed_minute?: number | null;
          extra_minute?: number | null;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          fulltime_home_score?: number | null;
          fulltime_away_score?: number | null;
          extratime_home_score?: number | null;
          extratime_away_score?: number | null;
          penalty_home_score?: number | null;
          penalty_away_score?: number | null;
          winner_team_id?: number | null;
          provider_updated_at?: string | null;
        };
        Update: {
          local_fixture_id?: string | null;
          competition_id?: number;
          season?: number;
          round?: string | null;
          home_team_id?: number;
          away_team_id?: number;
          home_team_name?: string;
          away_team_name?: string;
          home_team_logo?: string | null;
          away_team_logo?: string | null;
          venue_id?: number | null;
          venue_name?: string | null;
          venue_city?: string | null;
          referee?: string | null;
          kickoff_time?: string;
          api_status_short?: string | null;
          api_status_long?: string | null;
          status?: MatchStatus;
          elapsed_minute?: number | null;
          extra_minute?: number | null;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          fulltime_home_score?: number | null;
          fulltime_away_score?: number | null;
          extratime_home_score?: number | null;
          extratime_away_score?: number | null;
          penalty_home_score?: number | null;
          penalty_away_score?: number | null;
          winner_team_id?: number | null;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      match_events: {
        Row: {
          id: string;
          match_id: number;
          event_fingerprint: string;
          api_event_id: number | null;
          team_id: number | null;
          team_name: string | null;
          event_type: string;
          minute: number;
          minute_extra: number;
          player_name: string | null;
          player_id: number | null;
          assist_name: string | null;
          assist_id: number | null;
          detail: string | null;
          comments: string | null;
          is_active: boolean;
          provider_payload: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          event_fingerprint: string;
          api_event_id?: number | null;
          team_id?: number | null;
          team_name?: string | null;
          event_type: string;
          minute: number;
          minute_extra?: number;
          player_name?: string | null;
          player_id?: number | null;
          assist_name?: string | null;
          assist_id?: number | null;
          detail?: string | null;
          comments?: string | null;
          is_active?: boolean;
          provider_payload?: Json | null;
        };
        Update: {
          event_fingerprint?: string;
          api_event_id?: number | null;
          team_id?: number | null;
          team_name?: string | null;
          event_type?: string;
          minute?: number;
          minute_extra?: number;
          player_name?: string | null;
          player_id?: number | null;
          assist_name?: string | null;
          assist_id?: number | null;
          detail?: string | null;
          comments?: string | null;
          is_active?: boolean;
          provider_payload?: Json | null;
        };
        Relationships: [];
      };
      match_statistics: {
        Row: {
          id: string;
          match_id: number;
          team_id: number;
          provider_stat_name: string;
          stat_key: string;
          stat_value_raw: string;
          stat_value_numeric: number | null;
          unit: string | null;
          provider_updated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          team_id: number;
          provider_stat_name: string;
          stat_key: string;
          stat_value_raw: string;
          stat_value_numeric?: number | null;
          unit?: string | null;
          provider_updated_at?: string | null;
        };
        Update: {
          provider_stat_name?: string;
          stat_key?: string;
          stat_value_raw?: string;
          stat_value_numeric?: number | null;
          unit?: string | null;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      match_lineups: {
        Row: {
          id: string;
          match_id: number;
          team_id: number;
          player_id: number;
          player_name: string;
          shirt_number: number | null;
          position: string | null;
          grid_position: string | null;
          formation: string | null;
          coach_name: string | null;
          is_starter: boolean;
          is_active: boolean;
          provider_updated_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          team_id: number;
          player_id: number;
          player_name: string;
          shirt_number?: number | null;
          position?: string | null;
          grid_position?: string | null;
          formation?: string | null;
          coach_name?: string | null;
          is_starter?: boolean;
          is_active?: boolean;
          provider_updated_at?: string | null;
        };
        Update: {
          player_name?: string;
          shirt_number?: number | null;
          position?: string | null;
          grid_position?: string | null;
          formation?: string | null;
          coach_name?: string | null;
          is_starter?: boolean;
          is_active?: boolean;
          provider_updated_at?: string | null;
        };
        Relationships: [];
      };
      editorial_theses: {
        Row: {
          id: string;
          match_id: number;
          author_id: string;
          thesis_text: string;
          original_thesis_text: string;
          ai_restatement: string | null;
          angle_tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          author_id: string;
          thesis_text: string;
          original_thesis_text: string;
          ai_restatement?: string | null;
          angle_tags?: string[];
        };
        Update: {
          thesis_text?: string;
          original_thesis_text?: string;
          ai_restatement?: string | null;
          angle_tags?: string[];
        };
        Relationships: [];
      };
      ai_evidence: {
        Row: {
          id: string;
          thesis_id: string;
          match_id: number;
          evidence_type: string;
          source_table: string;
          source_id: string | null;
          content: string;
          supports_thesis: boolean | null;
          relevance_score: number;
          model: string | null;
          prompt_version: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thesis_id: string;
          match_id: number;
          evidence_type: string;
          source_table: string;
          source_id?: string | null;
          content: string;
          supports_thesis?: boolean | null;
          relevance_score?: number;
          model?: string | null;
          prompt_version?: string | null;
        };
        Update: {
          evidence_type?: string;
          source_table?: string;
          source_id?: string | null;
          content?: string;
          supports_thesis?: boolean | null;
          relevance_score?: number;
          model?: string | null;
          prompt_version?: string | null;
        };
        Relationships: [];
      };
      briefs: {
        Row: {
          id: string;
          match_id: number;
          thesis_id: string | null;
          author_id: string;
          publisher_id: string | null;
          title: string;
          subtitle: string | null;
          status: BriefStatus;
          read_time_minutes: number;
          slug: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: number;
          thesis_id?: string | null;
          author_id: string;
          publisher_id?: string | null;
          title: string;
          subtitle?: string | null;
          status?: BriefStatus;
          read_time_minutes?: number;
          slug?: string | null;
          published_at?: string | null;
        };
        Update: {
          thesis_id?: string | null;
          author_id?: string;
          publisher_id?: string | null;
          title?: string;
          subtitle?: string | null;
          status?: BriefStatus;
          read_time_minutes?: number;
          slug?: string | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
      brief_sections: {
        Row: {
          id: string;
          brief_id: string;
          section_type: SectionType;
          sort_order: number;
          content: string;
          ai_generated: boolean;
          edited_by_human: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          section_type: SectionType;
          sort_order?: number;
          content: string;
          ai_generated?: boolean;
          edited_by_human?: boolean;
        };
        Update: {
          section_type?: SectionType;
          sort_order?: number;
          content?: string;
          ai_generated?: boolean;
          edited_by_human?: boolean;
        };
        Relationships: [];
      };
      brief_feedback: {
        Row: {
          id: string;
          brief_id: string;
          section_id: string;
          user_id: string | null;
          anonymous_identity: string | null;
          feedback_type: FeedbackType;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brief_id: string;
          section_id: string;
          user_id?: string | null;
          anonymous_identity?: string | null;
          feedback_type: FeedbackType;
          comment?: string | null;
        };
        Update: {
          feedback_type?: FeedbackType;
          comment?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_editor: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      match_status: MatchStatus;
      brief_status: BriefStatus;
      section_type: SectionType;
      feedback_type: FeedbackType;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
