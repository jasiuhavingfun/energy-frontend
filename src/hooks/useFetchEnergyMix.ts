import { useEffect, useState } from "react";
import type { EnergyMixResponse } from "../types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export function useFetchEnergyMix() {
  const [data, setData] = useState<EnergyMixResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/energy-mix`);
        if (!res.ok) throw new Error("Failed to fetch energy mix data");
        const json: EnergyMixResponse = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error };
}
