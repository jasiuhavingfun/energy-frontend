import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  title: string;
  mix: Record<string, number>;
  cleanEnergyPercent: number;
}

export default function DoughnutChart({ title, mix, cleanEnergyPercent }: Props) {
  const labels = Object.keys(mix);
  const values = Object.values(mix);

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour12: false,
    });
  }

  const cleanEnergySources = ["biomass", "nuclear", "hydro", "wind", "solar", "geothermal"];
  const fossilFuels = ["coal", "gas", "oil"];

  const greenShades = [
    "rgba(34, 197, 94, 0.7)",   // green-500
    "rgba(22, 163, 74, 0.7)",   // green-600
    "rgba(21, 128, 61, 0.7)",   // green-700
    "rgba(74, 222, 128, 0.7)",  // green-400
    "rgba(134, 239, 172, 0.7)", // green-300
    "rgba(16, 185, 129, 0.7)",  // emerald-500
  ];

  const redShades = [
    "rgba(239, 68, 68, 0.7)",   // red-500
    "rgba(249, 115, 22, 0.7)",  // orange-500
    "rgba(220, 38, 38, 0.7)",   // red-600
  ];

  const grayColor = "rgba(156, 163, 175, 0.7)"; // gray-400

  function getColor(label: string, index: number): string {
    const lowerLabel = label.toLowerCase();
    if (cleanEnergySources.some(source => lowerLabel.includes(source))) {
      return greenShades[index % greenShades.length];
    }
    if (fossilFuels.some(fuel => lowerLabel.includes(fuel))) {
      return redShades[index % redShades.length];
    }
    return grayColor;
  }

  const backgroundColor = labels.map((label, i) => getColor(label, i));

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor: "#fff",
        borderWidth: 1
      }
    ]
  };

  // const options = {
  //   plugins: {
  //     legend: {
  //       display: false
  //     }
  //   }
  // };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-2">{formatDate(title)}</h3>
      
      <div className="w-80 h-80">
        <Doughnut data={data} />
      </div>

      <p className="text-sm mt-4">
        Clean Energy: {cleanEnergyPercent.toFixed(2)}%
      </p>
    </div>
  );
}
