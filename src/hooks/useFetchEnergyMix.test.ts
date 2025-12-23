import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useFetchEnergyMix } from "./useFetchEnergyMix";

describe("useFetchEnergyMix", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetches energy mix data on mount", async () => {
    const mockData = {
      days: [
        {
          date: "2025-12-22",
          averageMix: { solar: 30, wind: 25, nuclear: 20, gas: 15, coal: 10 },
          cleanEnergyPercent: 75,
        },
        {
          date: "2025-12-23",
          averageMix: { solar: 25, wind: 30, nuclear: 20, gas: 15, coal: 10 },
          cleanEnergyPercent: 75,
        },
      ],
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result } = renderHook(() => useFetchEnergyMix());

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith("/energy-mix");
  });

  it("handles fetch error", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useFetchEnergyMix());

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch energy mix data");
      expect(result.current.data).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it("handles network error", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchEnergyMix());

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
      expect(result.current.data).toBeNull();
    });
  });
});
