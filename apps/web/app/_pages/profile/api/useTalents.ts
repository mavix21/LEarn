"use client";

import { useQuery } from "@tanstack/react-query";

interface DataPoint {
  id: number;
  name: string;
  value: string;
  is_maximum: boolean;
  multiplier: number;
  readable_value: string | null;
  multiplication_result: string;
}

interface PointsCalculationLogic {
  points: number;
  max_points: number;
  data_points: DataPoint[];
  points_description: string;
  points_number_calculated: number;
}

interface Talent {
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

interface TalentsResponse {
  credentials: Talent[];
}

export function useTalents(id: string, accountSource: string) {
  return useQuery({
    queryKey: ["talents", id, accountSource],
    queryFn: async (): Promise<Talent[]> => {
      const url = new URL("/api/talents", window.location.origin);
      url.searchParams.append("id", id);
      url.searchParams.append("accountSource", accountSource);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const data: TalentsResponse = await response.json();
      return data.credentials;
    },
  });
}
