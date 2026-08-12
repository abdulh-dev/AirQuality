# Air Quality Tracker

A full-stack air quality monitoring system with three parts: a **sensor client** that streams readings from a Raspberry Pi, a **FastAPI backend** that stores them in Supabase and pulls public AQI data, and a **React dashboard** that visualizes live and historical readings.

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Backend API reference](#backend-api-reference)
- [Database schema (Supabase)](#database-schema-supabase)
- [Known limitations / in progress](#known-limitations--in-progress)
- [License](#license)

## Overview

The project tracks particulate matter (PM2.5 / PM10) readings from a physical sensor and compares them against public air quality data:

- A **sensor script** running on something like a Raspberry Pi reads a local CSV of readings and streams them over WebSocket to the backend.
- The **backend** (FastAPI) receives those readings, writes them to a Supabase (Postgres) table, and separately fetches live city-level AQI from the IQAir/AirVisual API for comparison.
- The **frontend** (React + Vite) shows a live dashboard of the sensor data, plus a history page that can display either the private sensor archive (from Supabase) or a public historical archive (static PM2.5 data for New York-area monitoring sites, 2020–2022).

## Architecture

```
Sensor (Raspberry Pi, Sensort.py)
        │  WebSocket  /ws/ingest
        ▼
FastAPI Backend (main.py)  ───────►  IQAir / AirVisual API
        │  writes readings              (public city AQI,
        ▼                                via /public/collect)
Supabase (Postgres)
   ├─ airqualitydata   (private sensor readings)
   └─ locationaqi      (public city AQI snapshots)
        │  read directly with the Supabase anon key
        ▼
React Dashboard (Vite + MUI + Recharts)
```

Note that the frontend currently talks to Supabase directly (using the anon key) for live and historical sensor data, rather than going through the backend's REST endpoints. The backend's REST API is available for ingestion, CSV upload, and the public-AQI collection job.

## Repository structure

```
AirQuality Project/
├── AirQualityProject_BackEnd/
│   ├── main.py            FastAPI app: REST routes, Supabase queries, WebSocket ingest
│   ├── requirements.txt   fastapi, uvicorn, supabase, pandas, requests, python-dotenv
│   └── render.yaml        Render.com deployment config
│
├── AirQualityProject_FrontEnd/
│   └── AirQualityProject-main/
│       ├── src/
│       │   ├── components/NavBar.jsx        Top navigation
│       │   ├── pages/Dashboard.jsx          Live chart + table + min/max cards
│       │   ├── pages/History.jsx            Toggle between private/public archives
│       │   ├── pages/Settings.jsx           Placeholder ("coming soon")
│       │   ├── utils/LineChart.jsx          Live PM2.5/PM10 chart (Supabase)
│       │   ├── utils/TableChart.jsx         Recent readings table (Supabase)
│       │   ├── utils/Averages.jsx           Min/max summary cards (Supabase)
│       │   ├── utils/PrivateSensorArchive.jsx  Filterable historical sensor chart
│       │   ├── utils/PublicDataArchive.jsx     Filterable static archive chart
│       │   └── sources/year_2020.json, year_2021.json, year_2022.json
│       ├── package.json
│       └── vite.config.js
│
└── AirQualityProject_Sensor/
    └── Sensort.py          Raspberry Pi WebSocket client, streams sensor_data.csv
```

## Features

- **Live dashboard** — line chart and table of the most recent PM2.5/PM10 readings, plus min/max summary cards, polling Supabase every 10 seconds.
- **Private sensor archive** — historical readings from your own sensor, filterable by year and month.
- **Public data archive** — static historical PM2.5 averages from New York-area monitoring sites (2020–2022), filterable by year and month, for comparison against your own readings.
- **Public city AQI collection** — backend endpoint that queries the IQAir/AirVisual API for a list of cities and stores the results.
- **CSV bulk upload** and a **WebSocket ingest endpoint** for streaming sensor data in real time.
- **Settings page** — placeholder for configurable alert thresholds (not yet implemented).

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, Material UI, Recharts, React Router, Supabase JS client |
| Backend | FastAPI, Uvicorn, Supabase Python client, pandas, requests |
| Sensor client | Python, `websockets`, `csv` |
| Database | Supabase (Postgres) |
| Deployment | Render (backend) |

## Getting started

### Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- A Supabase project with the two tables described in [Database schema](#database-schema-supabase)
- (Optional) An IQAir/AirVisual API key, for the public city AQI endpoint

### Backend

```bash
cd "AirQuality Project/AirQualityProject_BackEnd"
pip install -r requirements.txt
```

Set the following environment variables (e.g. in a `.env` file, or in Render's dashboard for deployment):

```
DATABASE_URL=your-supabase-project-url
DATABASE_KEY=your-supabase-key
PUBLIC_AQI_API_KEY=your-iqair-airvisual-api-key
```

Run locally:

```bash
uvicorn main:app --reload
```

`render.yaml` is already set up to deploy this service on [Render](https://render.com) with:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend

```bash
cd "AirQuality Project/AirQualityProject_FrontEnd/AirQualityProject-main"
npm install
npm run dev
```

> **Note:** the Supabase URL and anon key are currently hardcoded directly in `src/utils/LineChart.jsx`, `TableChart.jsx`, `Averages.jsx`, and `PrivateSensorArchive.jsx`. Before deploying publicly, consider moving these into a `.env` file and reading them with `import.meta.env`, and confirm your Supabase table has row-level security policies you're comfortable with, since the anon key is exposed in client code.

### Sensor client

1. Edit `WS_SERVER` at the top of `Sensort.py` to point at your backend's address, e.g. `ws://<backend-host>:8000/ws/ingest`.
2. Provide a `sensor_data.csv` file in the same directory, with a header row followed by `pm2_5,pm10,aqi,timestamp` rows.
3. Run it:

```bash
python Sensort.py
```

Each row is sent to the backend once every 2 seconds, simulating a live sensor feed.

## Backend API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/private/latest` | Most recent reading from `airqualitydata` |
| `POST` | `/private/insert` | Insert a reading (`pm2_5`, `pm10`, `aqi`, `timestamp`) |
| `DELETE` | `/private/delete-oldest` | Delete the oldest stored reading |
| `GET` | `/private-data` | Last 20 readings, newest first |
| `POST` | `/public/collect` | Fetch current AQI for a list of cities from IQAir and upsert into `locationaqi` |
| `GET` | `/public-data` | Last 20 public city AQI entries |
| `POST` | `/upload-csv` | Bulk-insert readings from an uploaded CSV (columns: `pm2_5, pm10, aqi, timestamp`) |
| `WS` | `/ws/ingest` | Accepts comma-separated `pm2_5,pm10,aqi,timestamp` messages and stores each as a reading |

## Database schema (Supabase)

Inferred from the backend and frontend code — create these tables before running the app:

**`airqualitydata`**

| Column | Type |
|---|---|
| `id` | integer, primary key |
| `pm2_5` | float |
| `pm10` | float |
| `aqi` | integer |
| `timestamp` | timestamp / ISO 8601 text |

**`locationaqi`**

| Column | Type |
|---|---|
| `place_name` | text |
| `current_aqi` | integer |
| `last_updated` | timestamp / ISO 8601 text |

## Known limitations / in progress

- The Settings page is a placeholder, and its route is commented out in `App.jsx` — alert-threshold customization isn't wired up yet.
- Supabase credentials are hardcoded in several frontend files rather than loaded from environment variables.
- `/upload-csv` is flagged in the code as not its final form and may need further validation/optimization.
- The recent-readings table is capped at a limit of 8 rows due to a layout issue.
- No automated tests or CI configuration are currently included.

## License

No license file is currently included in this repository. Add one (e.g. MIT) if you'd like others to reuse or contribute to the code.
