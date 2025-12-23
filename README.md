# Energy Mix Frontend

A React application that displays UK energy mix data and helps users find the optimal "greenest" time to charge their electric vehicles.

## Features

- **Energy Mix Overview**: Displays doughnut charts showing the energy mix breakdown for the next few days
- **Clean Energy Tracking**: Visual distinction between clean energy sources (green) and fossil fuels (red)
- **EV Charging Optimizer**: Find the best time window to charge your electric vehicle based on clean energy availability

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS 4** for styling
- **Chart.js** with react-chartjs-2 for data visualization
- **React Router** for navigation
- **Vitest** with React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```sh
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_BACKEND_URL=http://localhost:8080/api
```

### Development

```sh
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Testing

### Run Tests

```sh
npm test
```

### Run Tests with Coverage

```sh
npm run test:coverage
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChargingForm.tsx       # EV charging time finder form
│   ├── DoughnutChart.tsx      # Energy mix doughnut chart
│   └── EnergyMixCharts.tsx    # Container for multiple charts
├── hooks/               # Custom React hooks
│   ├── useFetchChargingWindow.ts  # Fetch optimal charging window
│   └── useFetchEnergyMix.ts       # Fetch energy mix data
├── pages/               # Page components
│   └── App.tsx          # Main application page
├── types/               # TypeScript type definitions
    └── index.ts
```

## API Endpoints

The frontend expects the following backend endpoints:

- `GET /energy-mix` - Returns energy mix data for upcoming days
- `GET /charging-window?hours={1-6}` - Returns the optimal charging window for the specified duration
