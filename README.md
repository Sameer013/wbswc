# West Bengal Warehouse Management System

A real-time warehouse monitoring system built with Next.js 15, featuring live intrusion alerts, vehicle tracking, warehouse event feeds, and PDF report generation.

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Then update the values in `.env` — particularly the base URL:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 4. Start Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build & Deployment

### Build

```bash
npm run build
# or
pnpm build
```

```bash
great@SAMEERs-Laptop MINGW64 ~/Office/wb_warehouse/client (main)
$ npm run build

> vuexy-mui-nextjs-admin-template@4.0.0 build
> next build

   ▲ Next.js 15.5.12
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully in 9.9s
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (14/14)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
┌ ƒ /_not-found                             1 kB         103 kB
├ ƒ /[...not-found]                      2.01 kB         166 kB
├ ƒ /about                                 262 B         102 kB
├ ƒ /api/anpr                              139 B         102 kB
├ ƒ /api/events                            139 B         102 kB
├ ƒ /api/intrusion                         139 B         102 kB
├ ƒ /api/vehicles                          139 B         102 kB
├ ƒ /home                                10.4 kB         182 kB
├ ƒ /login                               9.02 kB         188 kB
├ ƒ /report                              1.14 kB         167 kB
├ ƒ /reports/summary/vehicle/pdf         2.01 kB         621 kB
├ ƒ /reports/vehicle/[id]/pdf            2.05 kB         621 kB
└ ƒ /vehicles                            27.2 kB         197 kB
+ First Load JS shared by all             102 kB
  ├ chunks/1255-ad409e5887c155b0.js      45.7 kB
  ├ chunks/4bd1b696-100b9d70ed4e49c1.js  54.2 kB
  └ other shared chunks (total)          2.12 kB


ƒ  (Dynamic)  server-rendered on demand
ƒ  (Dynamic)  server-rendered on demand


```

### Reload PM2 (after build)

```bash
pm2 reload
```

---

## API Documentation

All endpoints are prefixed with your base URL (configured in `.env`).

**Base URL:** `http://localhost:3000` _(or your configured domain)_

---

### `POST /api/events`

Log a warehouse event.

**Request Body:**

```json
{
  "type": "exit",
  "timestamp": "2026-03-10 15:43:00",
  "value": "1"
}
```

| Field       | Type     | Description                                               |
| ----------- | -------- | --------------------------------------------------------- |
| `type`      | `string` | Event type — must match a value in the `event_type` table |
| `timestamp` | `string` | Event time in `YYYY-MM-DD HH:mm:ss` format                |
| `value`     | `string` | Associated value (e.g. vehicle ID or count)               |

**Supported event types** (defined in `event_type` table):

| Type        | Description                       |
| ----------- | --------------------------------- |
| `entry`     | Vehicle entry at main gate        |
| `exit`      | Vehicle exit at main gate         |
| `loading`   | Loading activity at loading bay   |
| `unloading` | Unloading activity at loading bay |
| `anpr`      | ANPR camera event at perimeter    |
| `intrusion` | Intrusion Alert at perimeter      |

---

## Routes

| Route                          | Description                    |
| ------------------------------ | ------------------------------ |
| `/home`                        | Main dashboard with live feeds |
| `/vehicles`                    | Vehicle management             |
| `/report`                      | Reports overview               |
| `/reports/summary/vehicle/pdf` | Vehicle summary PDF report     |
| `/reports/vehicle/[id]/pdf`    | Individual vehicle PDF report  |
| `/login`                       | Authentication                 |

---

## Tech Stack

- **Framework:** Next.js 15 (Typescript)
- **UI:** MUI (Material UI)
- **ORM:** Prisma
- **DATABASE:** MySQL
- **PDF Generation:** `@react-pdf/renderer`
