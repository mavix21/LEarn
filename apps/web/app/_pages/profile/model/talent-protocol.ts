export interface DataPoint {
  id: number;
  name: string;
  value: string;
  is_maximum: boolean;
  multiplier: number;
  readable_value: string | null;
  multiplication_result: string;
}

export interface PointsCalculationLogic {
  points: number;
  max_points: number;
  data_points: DataPoint[];
  points_description: string;
  points_number_calculated: number;
}

export interface Talent {
  account_source: string;
  calculating_score: boolean;
  category: string;
  data_issuer_name: string;
  data_issuer_slug: string;
  description: string;
  external_url: string;
  immutable: boolean;
  last_calculated_at: string;
  max_score: number;
  name: string;
  points: number;
  points_calculation_logic: PointsCalculationLogic;
  slug: string;
  uom: string;
  updated_at: string;
}

export interface TalentsResponse {
  credentials: Talent[];
}
