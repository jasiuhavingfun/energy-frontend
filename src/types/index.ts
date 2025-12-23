export interface DayEnergyMix {
  date: string;
  averageMix: Record<string, number>;
  cleanEnergyPercent: number;
}

export interface EnergyMixResponse {
  days: DayEnergyMix[];
}

export interface ChargingWindowResponse {
  start: string;
  end: string;
  averageCleanEnergyPercent: number;
}
