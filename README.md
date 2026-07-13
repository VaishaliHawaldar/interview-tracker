# Interview Tracker

A Next.js app for tracking interview calls, rounds, and statuses, backed by a Notion database.

## Setup

### 1. Create a Notion integration

1. Go to https://www.notion.so/my-integrations and click **New integration**.
2. Give it a name (e.g. "Interview Tracker"), select your workspace, and create it.
3. Copy the **Internal Integration Secret** — this is your `NOTION_TOKEN`.

### 2. Create the Notion database

Create a new database in Notion called **Interview Tracker** with these properties:

| Property | Type |
|---|---|
| Company | Title |
| Role | Text |
| Round | Select — Applied, Phone Screen, Technical, Onsite, HR, Offer, Rejected |
| Date | Date |
| Status | Select — Scheduled, Awaiting Response, Passed, Rejected, Withdrawn |
| Interviewer | Text |
| Notes | Text |
| Next Action Date | Date |
| Job Link | URL |
| CTC | Text |
| Location | Text |
| Mode | Select — Remote, Onsite, Hybrid |

Property names must match exactly (case-sensitive) since the app reads/writes them by name.

### 3. Share the database with your integration

Open the database in Notion → **···** menu → **Connections** → add the "Interview Tracker" integration.

### 4. Get the database ID

Copy the database URL, e.g. `https://www.notion.so/myworkspace/1a2b3c4d5e6f7g8h9i0j...?v=...`. The `NOTION_DATABASE_ID` is the 32-character ID segment right after your workspace name (before any `?`).

### 5. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NOTION_TOKEN` and `NOTION_DATABASE_ID` in `.env.local`.

### 6. Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the interview table. Use **+ Add Interview** to add a new record — it's written directly to your Notion database.
