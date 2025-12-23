import { useState } from "react";
import type { ChargingWindowResponse } from "../types";

export function useFetchChargingWindow() {
  const [result, setResult] = useState<ChargingWindowResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchChargingWindow(hours: number) {
    if (hours < 1 || hours > 6) {
      setError("Hours must be between 1 and 6");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/charging-window?hours=${hours}`);
      if (!res.ok) throw new Error("Failed to fetch charging window");
      const json: ChargingWindowResponse = await res.json();
      setResult(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, fetchChargingWindow };
}
