import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EnergyMixCharts from "./EnergyMixCharts";
import type { DayEnergyMix } from "../types";

// Mock DoughnutChart since it uses Chart.js which is hard to test
vi.mock("./DoughnutChart", () => ({
  default: ({ title, cleanEnergyPercent }: { title: string; cleanEnergyPercent: number }) => (
    <div data-testid={`chart-${title}`}>
      <span>{title}</span>
      <span>{cleanEnergyPercent}%</span>
    </div>
  ),
}));

describe("EnergyMixCharts", () => {
  const mockDays: DayEnergyMix[] = [
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
  ];

  it("renders a chart for each day", () => {
    render(<EnergyMixCharts days={mockDays} />);

    expect(screen.getByTestId("chart-2025-12-22")).toBeInTheDocument();
    expect(screen.getByTestId("chart-2025-12-23")).toBeInTheDocument();
  });

  it("displays the correct dates", () => {
    render(<EnergyMixCharts days={mockDays} />);

    expect(screen.getByText("2025-12-22")).toBeInTheDocument();
    expect(screen.getByText("2025-12-23")).toBeInTheDocument();
  });

  it("renders empty when no days provided", () => {
    const { container } = render(<EnergyMixCharts days={[]} />);
    
    expect(container.querySelector("[data-testid^='chart-']")).not.toBeInTheDocument();
  });

  it("renders single day correctly", () => {
    render(<EnergyMixCharts days={[mockDays[0]]} />);

    expect(screen.getByTestId("chart-2025-12-22")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-2025-12-23")).not.toBeInTheDocument();
  });
});
