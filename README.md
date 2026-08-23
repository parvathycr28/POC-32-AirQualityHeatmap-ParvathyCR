# POC-32-AirQualityHeatmap-ParvathyCR

## Air Quality Heatmap

A Real Rails Intelligence Library POC focused on Data & Intelligence.

This project provides an interactive air quality dashboard that visualizes
pollution measurements, population exposure, and comparisons between cities.

## Why This Matters

Air pollution is not evenly distributed across cities. Combining pollution
measurements with population data helps show where larger numbers of people
may be exposed to poor air quality.

## Who Controls the Rail

Public agencies, environmental regulators, monitoring networks, and data
providers shape how pollution is measured, reported, and acted upon.

## Features

- Interactive city air quality map
- Pollutant selector
- Pollution time-series charts
- Exposure scoring
- City comparison
- Intelligence insights
- Interactive filters
- Map tooltips
- Downloadable sample data
- Automatic fallback to local synthetic data if live APIs fail

## Technology Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Leaflet
- React Leaflet
- Recharts

### Backend

- Python
- FastAPI
- Pandas
- GeoPandas

## Data Sources

- OpenAQ
- WorldPop

## Architecture

See the `architecture/` directory for the system architecture and data flow.

## Project Structure

```text
POC-01-AirQualityHeatmap-Paru/
├── README.md
├── architecture/
├── screenshots/
├── backend/
└── frontend/

# Execution Evidence

Screenshots demonstrating the working application are available in the screenshots/ directory.

# Security

API keys, passwords, tokens, and other secrets are stored outside the repository using environment variables.
No secrets should be committed to this public repository.

# Mock Data Fallback

If a live data source becomes unavailable or returns an error, the backend automatically falls back to locally stored synthetic data so the demo remains functional.
Synthetic data is clearly labeled in the application.

# Setup
Detailed installation and execution instructions will be added as the project is implemented.

# Limitations
This is a proof of concept. Exposure scores are analytical indicators for demonstration purposes and should not be interpreted as clinical or official public-health risk measurements.

# Future Improvements
Additional cities and regions
More pollutant types
Improved exposure methodology
Additional public data sources
Historical analysis
More detailed geographic layers