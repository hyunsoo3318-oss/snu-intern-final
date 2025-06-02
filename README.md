# SNUIntern

> _An internship discovery platform for finding, filtering, and bookmarking the roles that matter to you._

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-1.9-60A5FA?logo=biome&logoColor=white)

## Overview

SNUIntern is a single-page internship and job-listing application built with React 19,
TypeScript, and Vite. It lets visitors browse company postings, narrow results with a rich
set of job-role, industry, recruiting-status, and ordering filters, and—once signed in—bookmark
the postings they care about. Authenticated applicants can additionally build out a profile
(enrollment year, departments, and a CV) that is persisted through the backend API. The app talks
to a hosted REST API over an Axios client and manages session and listing state entirely through
React context.

## Technical Highlights

- **Token-based auth context** — `AuthProvider` (`src/auth.tsx`) exposes `signUp`, `login`,
  `logout`, the current `user`, and an `isLoading` flag through a typed `useAuth()` hook that
  throws if used outside the provider. The bearer token is persisted to `localStorage` under
  `authToken`; on mount and whenever the token changes, an effect re-validates the session by
  calling `/api/auth/me` and clears the token on failure.
- **Axios request interceptor** — `src/api.ts` configures a shared `apiClient` against the
  Internhasha API and installs a request interceptor that automatically attaches
  `Authorization: Bearer <token>` to every call **except** an explicit allowlist of public
  endpoints (sign-up and session/login `POST`s).
- **Listing state via context** — `PostProvider` (`src/post.tsx`) centralizes fetching,
  pagination, and bookmarking. It maps the verbose API response (`ApiPost`) down to the lean
  `Post` shape the UI needs, reads `paginator.lastPage` for page counts, and clears all bookmark
  flags reactively when the user logs out.
- **Composable query-param encoding** — `encodeQueryParams` builds the listing query with
  `URLSearchParams`, skipping `null`/`undefined` values and expanding arrays into repeated keys,
  so multi-select filters serialize correctly.
- **Home-page filtering logic** — `Home.tsx` derives the request query from filter state
  (`roles`, `isActive`, `domains`, `order`, `page`) inside an effect; selecting *all* domains or
  *no* roles collapses to `null` so the server returns the unfiltered set. Filter dropdowns stage
  selections locally and only commit them (resetting to page 1) on **Apply**, and a paginated
  five-button block navigates the `paginator.lastPage` range.
- **Intern card with always-hiring handling** — `InternCard.tsx` computes a D-day badge from
  `employmentEndDate` using UTC-normalized dates; postings with no end date (or the literal
  `상시`) render as **always hiring**, past dates render as **closed**, and everything else as
  `D-<n>`. Bookmarking is **optimistic**: the UI toggles immediately, fires the add/remove API
  call, and rolls back on error—prompting unauthenticated users to log in instead.
- **Profile creation flow** — `ProfilePage.tsx` loads any existing profile from
  `/api/applicant/me` (treating the `APPLICANT_002` "not found" code as a fresh profile),
  validates a two-digit enrollment year, up to seven unique departments, and a PDF CV under 5 MB,
  then derives a four-digit year and a generated `cvKey` before `PUT`ting the profile back.
- **Strict Biome lint + format** — `biome.json` pins a curated rule set including `noExplicitAny`,
  `noConsole` (allowing only `warn`/`error`/`info`), `useExhaustiveDependencies`, and
  `useHookAtTopLevel`, with two-space indentation, single quotes, 80-column width, and import
  organization enabled.
- **CI quality gate** — `.github/workflows/ci.yml` runs on every push and pull request to `main`,
  installs dependencies with Yarn on Node 20.11.1, and runs `yarn check-all`, which chains
  TypeScript type-checking (`tsc`), Biome formatting/lint (`biome check .`), and dead-code
  detection (`knip`).

## Tech Stack

- **Framework:** React 19, React Router DOM 7
- **Language:** TypeScript 5.8
- **Build tool:** Vite 6 with `@vitejs/plugin-react-swc`
- **HTTP client:** Axios
- **Icons:** React Icons
- **Tooling:** Biome 1.9 (lint + format), knip (unused-code detection), Yarn

## Getting Started

```bash
# Install dependencies
yarn install

# Start the Vite dev server
yarn dev

# Type-check, lint/format, and scan for unused code (the CI gate)
yarn check-all

# Build for production (type-check + Vite build)
yarn build
```

Individual checks are also available: `yarn check:types` (`tsc`), `yarn check:format`
(`biome check .`), `yarn lint` (`biome lint .`), and `yarn check:unused` (`knip`).
