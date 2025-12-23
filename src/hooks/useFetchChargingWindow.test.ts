import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetchChargingWindow } from "./useFetchChargingWindow";

describe("useFetchChargingWindow", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns initial state", () => {
    const { result } = renderHook(() => useFetchChargingWindow());

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets error when hours is less than 1", async () => {
    const { result } = renderHook(() => useFetchChargingWindow());

    await act(async () => {
      await result.current.fetchChargingWindow(0);
    });

    expect(result.current.error).toBe("Hours must be between 1 and 6");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("sets error when hours is greater than 6", async () => {
    const { result } = renderHook(() => useFetchChargingWindow());

    await act(async () => {
      await result.current.fetchChargingWindow(7);
    });

    expect(result.current.error).toBe("Hours must be between 1 and 6");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("fetches charging window successfully", async () => {
    const mockData = {
      start: "2025-12-22T10:00:00Z",
      end: "2025-12-22T13:00:00Z",
      averageCleanEnergyPercent: 75.5,
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    const { result } = renderHook(() => useFetchChargingWindow());

    await act(async () => {
      await result.current.fetchChargingWindow(3);
    });

    await waitFor(() => {
      expect(result.current.result).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    expect(globalThis.fetch).toHaveBeenCalledWith("/api/charging-window?hours=3");
  });

  it("handles fetch error", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useFetchChargingWindow());

    await act(async () => {
      await result.current.fetchChargingWindow(3);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch charging window");
      expect(result.current.result).toBeNull();
    });
  });

  it("handles network error", async () => {
    vi.mocked(globalThis.fetch).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchChargingWindow());

    await act(async () => {
      await result.current.fetchChargingWindow(3);
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Network error");
    });
  });

  it("sets loading state during fetch", async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(globalThis.fetch).mockReturnValue(promise);

    const { result } = renderHook(() => useFetchChargingWindow());

    act(() => {
      result.current.fetchChargingWindow(3);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: () => Promise.resolve({ start: "", end: "", averageCleanEnergyPercent: 0 }),
      } as Response);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
