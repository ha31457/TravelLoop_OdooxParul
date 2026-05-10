# TravelLoop

> An intelligent full-stack travel planning platform with AI-powered itinerary suggestions, budget estimation, packing assistance, and collaborative trip management.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [AI Features](#ai-features)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

TravelLoop is a full-stack travel management platform that goes beyond basic trip planning. It combines structured itinerary management with Google Gemini AI to deliver smart, context-aware suggestions at exactly the right moment — from the moment a trip is created to the day it is published and shared.

Users can plan multi-city trips, track budgets, manage packing lists, write travel journals, and share itineraries publicly or with collaborators — all within a single cohesive experience.

---

## Features

### Core
- **Trip Management** — Create, update, publish, and soft-delete trips with status tracking (`Draft → Planned → Ongoing → Completed`)
- **Multi-Stop Itineraries** — Add ordered city stops with arrival/departure dates, drag-and-drop reordering, and per-stop notes
- **Activity Catalogue** — Browse and add curated city activities to stops, with category filtering, cost estimates, and duration info
- **Budget Tracking** — Log actual and estimated expenses by category with real-time budget summaries and per-day averages
- **Packing Checklist** — Categorized packing lists with packed/unpacked state and bulk reset
- **Trip Journal** — Rich note-taking at trip or stop level with date tagging
- **Public Sharing** — Publish trips via unique slugs; share with collaborators via email with read or copy permissions
- **Trip Cloning** — Copy any public trip as a personal draft with full stop and activity structure preserved

### AI-Powered (Google Gemini)
- **Itinerary Suggestion** — On trip creation, AI suggests a full multi-city stop sequence based on trip name, dates, budget, and description
- **Activity Recommendation** — On stop creation, AI recommends 3–5 relevant activities for the city, creating catalogue entries if they don't exist
- **Budget Estimation** — On trip publish, AI generates category-wise expense estimates saved as `IsEstimate = true` budget entries
- **Packing List Generation** — On trip publish, AI suggests a destination-aware packing list returned for user confirmation before saving
- **Note Summarization** — When a trip accumulates 5+ journal notes, AI auto-generates a concise summary note tagged `"Summary"`

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | ASP.NET Core 8 |
| Language | C# 12 |
| ORM | Entity Framework Core 8 |
| Database | SQL Server (SQLEXPRESS) |
| Auth | ASP.NET Core Identity + JWT Bearer |
| AI | Google Gemini 2.5 Flash (REST API) |
| Architecture | Service Layer + Repository Pattern |

### Frontend
| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | TBD |

---

## Architecture

```
TravelLoop/
├── Backend (ASP.NET Core)
│   ├── Controllers        → HTTP layer, route handling
│   ├── Services           → Business logic
│   │   ├── AiService      → Gemini API integration
│   │   ├── TripService
│   │   ├── TripStopService
│   │   ├── BudgetService
│   │   ├── PackingService
│   │   ├── NoteService
│   │   ├── SharingService
│   │   ├── ActivityService
│   │   ├── LocationService
│   │   └── UserService
│   ├── Models             → EF Core entities + enums
│   ├── Models/DTOs        → Request/Response DTOs
│   ├── Data               → ApplicationDbContext + DbSeeder
│   └── Settings           → Strongly-typed config (Gemini, JWT)
│
└── Frontend (Next.js)
    ├── app/               → App Router pages
    ├── components/        → Reusable UI components
    ├── lib/               → API client, utilities
    └── types/             → TypeScript interfaces
```

### AI Trigger Map

| Event | AI Action | Persistence |
|---|---|---|
| `POST /api/trip` | Suggest itinerary stops | Saved as `TripStop` records |
| `POST /api/trips/{id}/stops` | Recommend city activities | Saved as `CityActivity` + `StopActivity` |
| `POST /api/trips/{id}/publish` | Estimate budget by category | Saved as `BudgetExpense` (`IsEstimate=true`) |
| `POST /api/trips/{id}/publish` | Generate packing list | Returned to client; saved on confirmation |
| `GET /api/trip/{id}` | Summarize journal notes (5+) | Saved as `TripNote` with `Tag="Summary"` |

---

## Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (or SQL Server Express)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/travelloop.git
cd travelloop/backend

# Restore dependencies
dotnet restore

# Apply database migrations
dotnet ef database update

# Run the API
dotnet run
```

The API will be available at `http://localhost:5081`.

On first run, the database seeder automatically populates:
- 10 countries, 18 cities across Europe, Asia, Middle East, and Oceania
- 60+ curated city activities with categories, costs, and images
- 3 sample trips with stops, activities, budgets, packing lists, and notes
- 3 seed users (admin, friend, test)

**Seed credentials:**

| Email | Password | Role |
|---|---|---|
| `admin@travel.com` | `Admin@123!` | Admin |
| `friend@example.com` | `Friend@123!` | User |
| `test@travel.com` | `Test@123!` | User |

---

### Frontend Setup

```bash
cd travelloop/frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

### Environment Variables

#### Backend — `appsettings.json`

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TravelDB;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-minimum-32-characters",
    "Issuer": "TravelLoop",
    "Audience": "TravelLoopUsers",
    "ExpiryMinutes": "1440"
  },
  "GeminiSettings": {
    "ApiKey": "your-gemini-api-key",
    "Model": "gemini-2.5-flash",
    "BaseUrl": "https://generativelanguage.googleapis.com/v1beta/models"
  }
}
```

#### Frontend — `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5081
```

---

## AI Features

TravelLoop integrates Google Gemini 2.5 Flash as a generative backend for travel intelligence. All AI calls are fire-and-forget where they shouldn't block the user (itinerary, activities), and synchronous where the output is part of the response (budget, packing list).

### Hybrid City/Activity Resolution

When AI suggests a city or activity that does not exist in the database, TravelLoop creates a minimal record flagged with `IsAiGenerated = true`. This keeps the data model consistent while allowing AI to extend the catalogue organically.

### Confirmation Flow for Packing Lists

The packing list is not saved automatically. It is returned as part of the publish response, allowing the user to review and confirm before persisting via:

```
POST /api/trips/{tripId}/packing/ai-save
```

---

## API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current authenticated user |

### Trips
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trip` | Get paginated user trips |
| POST | `/api/trip` | Create a new trip (triggers AI itinerary) |
| GET | `/api/trip/{id}` | Get trip detail (triggers AI note summary) |
| PUT | `/api/trip/{id}` | Update trip |
| DELETE | `/api/trip/{id}` | Delete trip |
| POST | `/api/trip/{id}/publish` | Publish trip (triggers AI budget + packing) |
| GET | `/api/trip/public/{slug}` | Get public trip by slug |
| POST | `/api/trip/copy/{slug}` | Clone a public trip |

### Stops
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trips/{id}/stops` | Add stop (triggers AI activity suggestions) |
| PUT | `/api/trips/{id}/stops/{stopId}` | Update stop |
| DELETE | `/api/trips/{id}/stops/{stopId}` | Delete stop and resequence |
| POST | `/api/trips/{id}/stops/reorder` | Reorder stops |
| POST | `/api/trips/{id}/stops/{stopId}/activities` | Add activity to stop |
| PUT | `/api/trips/{id}/stops/{stopId}/activities/{id}` | Update stop activity |
| DELETE | `/api/trips/{id}/stops/{stopId}/activities/{id}` | Remove activity from stop |

### Budget
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips/{id}/budget/summary` | Get budget summary with breakdown |
| GET | `/api/trips/{id}/budget/expenses` | Get all expenses |
| POST | `/api/trips/{id}/budget/expenses` | Add expense |
| PUT | `/api/trips/{id}/budget/expenses/{expenseId}` | Update expense |
| DELETE | `/api/trips/{id}/budget/expenses/{expenseId}` | Delete expense |

### Packing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips/{id}/packing` | Get packing checklist grouped by category |
| POST | `/api/trips/{id}/packing/items` | Add item manually |
| PUT | `/api/trips/{id}/packing/items/{itemId}` | Update item (including packed state) |
| DELETE | `/api/trips/{id}/packing/items/{itemId}` | Remove item |
| POST | `/api/trips/{id}/packing/reset` | Mark all items as unpacked |
| POST | `/api/trips/{id}/packing/ai-save` | Save AI-suggested packing list |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips/{id}/notes` | Get notes (optionally filter by stop) |
| POST | `/api/trips/{id}/notes` | Add note |
| PUT | `/api/trips/{id}/notes/{noteId}` | Update note |
| DELETE | `/api/trips/{id}/notes/{noteId}` | Delete note |

### Sharing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/trips/{id}/sharing` | Get all shares for a trip |
| POST | `/api/trips/{id}/sharing` | Share trip with an email |
| DELETE | `/api/trips/{id}/sharing/{shareId}` | Revoke a share |

### Locations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/location/cities/search` | Search cities with filters |
| GET | `/api/location/cities/{id}` | Get city by ID |
| GET | `/api/location/countries` | Get all countries |

### Activities
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/activity/search` | Search activities for a city |
| GET | `/api/activity/{id}` | Get activity by ID |

### User
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/profile` | Get user profile |
| PUT | `/api/user/profile` | Update profile |
| DELETE | `/api/user/account` | Deactivate account |
| POST | `/api/user/destinations/{cityId}` | Save a destination |
| DELETE | `/api/user/destinations/{cityId}` | Remove saved destination |
| GET | `/api/user/destinations` | Get all saved destinations |

---

## Database Schema

### Core Entities

```
User ──< Trip ──< TripStop ──< StopActivity >── CityActivity ──< ActivityImage
                     │
                     ├──< BudgetExpense
                     ├──< PackingItem
                     └──< TripNote

Country ──< City ──< CityActivity
                └──< TripStop

User ──< SavedDestination >── City
Trip ──< TripShare
```

### Key Enums

| Enum | Values |
|---|---|
| `TripStatus` | `Draft, Planned, Ongoing, Completed, Cancelled` |
| `ActivityCategory` | `Sightseeing, FoodAndDrink, Adventure, Culture, Shopping, Wellness, Nightlife, Nature, Transportation, Accommodation, Other` |
| `ExpenseCategory` | `Transport, Accommodation, Activities, Meals, Shopping, Visa, Insurance, Other` |
| `PackingCategory` | `Clothing, Documents, Electronics, Toiletries, Medicines, Other` |
| `SharePermission` | `ReadOnly, CanCopy` |

---

## Project Structure

```
backend/
├── Controllers/
│   ├── AuthController.cs
│   ├── TripController.cs
│   ├── TripStopController.cs
│   ├── BudgetController.cs
│   ├── PackingController.cs
│   ├── NoteController.cs
│   ├── SharingController.cs
│   ├── ActivityController.cs
│   ├── LocationController.cs
│   └── UserController.cs
├── Services/
│   ├── Interfaces/
│   ├── AiService.cs
│   ├── TripService.cs
│   ├── TripStopService.cs
│   ├── BudgetService.cs
│   ├── PackingService.cs
│   ├── NoteService.cs
│   ├── SharingService.cs
│   ├── ActivityService.cs
│   ├── LocationService.cs
│   ├── UserService.cs
│   └── JwtService.cs
├── Models/
│   ├── DTOs/
│   └── *.cs (entities + enums)
├── Data/
│   ├── ApplicationDbContext.cs
│   └── DbSeeder.cs
├── Settings/
│   └── GeminiSettings.cs
├── Migrations/
└── Program.cs
```

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature-name`
3. Commit your changes — `git commit -m "feat: add your feature"`
4. Push to the branch — `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

*Built with ASP.NET Core and Next.js*
