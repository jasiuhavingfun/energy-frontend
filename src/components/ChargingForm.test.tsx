import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChargingForm from "./ChargingForm";

describe("ChargingForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the form with input and submit button", () => {
    render(<ChargingForm />);

    expect(screen.getByText(/find/i)).toBeInTheDocument();
    expect(screen.getByText(/"greenest"/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter hours/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("allows entering charging duration", async () => {
    const user = userEvent.setup();
    render(<ChargingForm />);

    const input = screen.getByPlaceholderText(/enter hours/i);
    await user.type(input, "3");

    expect(input).toHaveValue(3);
  });

  it("shows loading state when submitting", async () => {
    // Mock fetch to delay response
    vi.mocked(globalThis.fetch).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({
          start: "2025-12-22T10:00:00Z",
          end: "2025-12-22T13:00:00Z",
          averageCleanEnergyPercent: 75.5,
        }),
      } as Response), 100))
    );

    const user = userEvent.setup();
    render(<ChargingForm />);

    const input = screen.getByPlaceholderText(/enter hours/i);
    await user.type(input, "3");
    
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("displays result after successful fetch", async () => {
    const mockResult = {
      start: "2025-12-22T10:00:00Z",
      end: "2025-12-22T13:00:00Z",
      averageCleanEnergyPercent: 75.5,
    };

    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResult),
    } as Response);

    const user = userEvent.setup();
    render(<ChargingForm />);

    const input = screen.getByPlaceholderText(/enter hours/i);
    await user.type(input, "3");
    
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/75\.50%/)).toBeInTheDocument();
    });
  });

  it("displays error when fetch fails", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    const user = userEvent.setup();
    render(<ChargingForm />);

    const input = screen.getByPlaceholderText(/enter hours/i);
    await user.type(input, "3");
    
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });
  });

  it("does not submit when hours field is empty", async () => {
    const user = userEvent.setup();
    render(<ChargingForm />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
