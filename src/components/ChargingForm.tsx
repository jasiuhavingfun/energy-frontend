import { useState } from "react";
import { useFetchChargingWindow } from "../hooks/useFetchChargingWindow";

export default function ChargingForm() {
  const [hours, setHours] = useState<number | "">("");
  const { result, loading, error, fetchChargingWindow } = useFetchChargingWindow();

  function submit() {
    if (hours !== "") {
      fetchChargingWindow(hours);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">find <span className="text-green-500">"greenest"</span> time to charge your electric vehicle in the next 2 days</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Charging duration:
        </label>
        <input
          type="number"
          min={1}
          max={6}
          value={hours}
          onChange={(e) => setHours(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
          placeholder="Enter hours (1-6)"
          className="border rounded w-full p-2"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Submit
        </button>
      </div>

      {loading && <p className="mt-4 text-sm">Loading...</p>}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 border p-4 rounded">
          <p><strong>Start:</strong> {formatDate(result.start)}</p>
          <p><strong>End:</strong> {formatDate(result.end)}</p>
          <p>
            <strong>Average Clean Energy:</strong>{" "}
            {result.averageCleanEnergyPercent.toFixed(2)}%
          </p>
        </div>
      )}
    </form>
  );
}
