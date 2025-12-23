import DoughnutChart from "./DoughnutChart";
import type { DayEnergyMix } from "../types";

interface Props {
  days: DayEnergyMix[];
}

export default function EnergyMixCharts({ days }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '2rem', width: '100%' }}>
      {days.map((d) => (
        <DoughnutChart
          key={d.date}
          title={d.date}
          mix={d.averageMix}
          cleanEnergyPercent={d.cleanEnergyPercent}
        />
      ))}
    </div>
  );
}
