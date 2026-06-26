// Backend API kontrakt tiplari (SKAZKA /api/v1).
export type AgeBand = "3-4" | "5-6" | "6-7";

export type Parent = {
  id: string;
  phone: string | null;
  email: string | null;
  full_name: string;
  locale: string;
};

export type ChildProfile = {
  id: string;
  display_name: string;
  avatar_id: string;
  age_band: AgeBand;
  l1_locale: string;
  is_active: boolean;
  has_pin: boolean;
  created_at: string;
};

export type AuthResponse = { access: string; refresh: string; parent: Parent };
