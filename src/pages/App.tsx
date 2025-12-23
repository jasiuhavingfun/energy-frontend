import { useFetchEnergyMix } from "../hooks/useFetchEnergyMix";
import EnergyMixCharts from "../components/EnergyMixCharts";
import ChargingForm from "../components/ChargingForm";

export default function App() {
  const { data, loading, error } = useFetchEnergyMix();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        <a href="https://www.neso.energy/" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(103, 5, 83, 1)' }} className="text-6xl [text-shadow:0_0_1px_currentColor]">UK's</a> Energy Mix Overview
      </h1>

      {loading && <p>Loading energy mix data...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="mb-10">
          <EnergyMixCharts days={data.days} />
        </div>
      )}

      <div className="mt-18">
        <ChargingForm />
      </div>
    </div>
  );
}
