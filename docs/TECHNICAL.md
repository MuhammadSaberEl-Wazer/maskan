# Maskan POC — Technical Reference

> **Purpose:** Canonical technical reference for continuing the project locally with Codex, Claude Code, or another developer. Read this file together with `docs/BUSINESS.md` before making structural changes. Update this file whenever an architectural decision changes.

## 1. Project Goal

Build a functional, investor-ready Proof of Concept for **Maskan**, an Egypt-wide managed-housing operator supporting both shared housing and complete family apartments. The POC must demonstrate both the customer journey and Maskan's operating/admin view using realistic demo data.

This is a **Next.js application**, not a standalone Vite/React SPA. Next.js itself uses React internally, but the framework and project structure must remain Next.js.

---

## 2. Required Stack

- **Next.js** — App Router
- **TypeScript**
- **pnpm** — required package manager
- **Tailwind CSS**
- **shadcn/ui** — component foundation/direction; customize it to Maskan rather than shipping a generic shadcn appearance
- **Supabase**
  - PostgreSQL database
  - Auth
  - Storage
  - Row Level Security (RLS)
- **Lucide React** for icons where needed

Do not migrate this project to Vite or a plain React SPA.

### Package manager

Use only:

```bash
pnpm install
pnpm dev
pnpm build
```

Do not add npm/yarn lockfiles. `pnpm-lock.yaml` is the canonical lockfile.

---

## 3. UX / UI Direction

### Core principles

- **Speed:** make the path from registration to a suitable space and move-in fast and easy;
- **Trust:** surface rent, deposit, inclusions, material costs, and the responsible operator clearly before commitment;
- **Safety:** reinforce controlled, documented identity, contracts, payments, deposits, and support activity;
- position Maskan for Egypt as a whole, without presenting it as Cairo-only;
- mobile-first customer experience;
- simple, elegant, premium/clean;
- minimal visual clutter;
- apartment-first visual experience;
- large, high-quality property photography;
- generous spacing;
- strong typography;
- restrained borders and shadows;
- warm/off-white neutral surfaces + charcoal typography + restrained brand accent;
- responsive tablet/desktop layouts;
- Admin is optimized particularly well for desktop/tablet while remaining usable on mobile.

Avoid the generic blue SaaS-dashboard aesthetic.

### shadcn/ui rule

Use shadcn/ui as a **component foundation**, not as the visual identity. Components should be restyled to match Maskan.

The Arabic interface uses **Cairo** as its primary typeface. Form inputs and text areas use shared shadcn-style primitives, while option menus use the accessible Radix Select primitive instead of unstyled browser-native selects.

### Property photography

Property imagery is a major part of the product. Each property should eventually have a gallery rather than a repeated placeholder image. Demo imagery should be high-quality and consistent enough to make the standardized-housing proposition believable.

---

## 4. Application Areas

The application has three logical surfaces:

1. **Public / discovery**
2. **Resident / My Maskan**
3. **Admin / operations**

### Roles

Initial data model supports:

- `resident`
- `staff`
- `area_manager`
- `admin`

A Unit Representative is conceptually a resident with limited unit-coordination capabilities, not a normal admin role. Do not give Unit Representatives access to payments, contracts, penalties, or other residents' private information.

---

## 5. Target Routes

### Public / customer

```text
/
/explore
/property/[slug]
/login
/register
/book/[bedId]
```

The booking flow may initially be implemented as one route with steps or as nested routes/components. Prefer the simplest maintainable implementation for the POC.

### Resident

```text
/my-maskan
/my-maskan/stay
/my-maskan/payments
/my-maskan/maintenance
/my-maskan/contract
/my-maskan/support
```

### Admin

```text
/admin
/admin/properties
/admin/properties/[id]
/admin/rooms
/admin/residents
/admin/bookings
/admin/contracts
/admin/payments
/admin/maintenance
/admin/settings
```

Not every target route is implemented yet. Treat this as the target POC information architecture, not a claim that all routes currently exist.

---

## 6. Main User Flows

### Customer discovery and booking

```text
Home
→ Explore
→ Filter/search
→ Property Details
→ Select Room/Bed or Complete Family Unit
→ Login/Register if needed
→ Stay duration + move-in
→ Resident details
→ Booking review
→ Dummy payment / POC confirmation
→ Booking confirmation
→ My Maskan
```

Suggested Explore filters:

- area;
- rental model: shared housing / complete family apartment;
- gender;
- Maskan tier;
- private/shared/full unit;
- price;
- available now.

### Resident

```text
My Maskan
→ current stay
→ next payment / payment history
→ deposit status
→ contract
→ cleaning information
→ maintenance request
→ support
→ renewal
```

### Maintenance

```text
Resident submits request
→ Submitted
→ Assigned
→ In Progress
→ Resolved
```

Suggested categories:

- plumbing;
- electricity;
- furniture;
- appliance;
- internet;
- cleaning;
- other.

### Admin

```text
Dashboard KPIs
→ portfolio/properties
→ property detail
→ rooms/beds/residents
→ bookings/contracts/payments
→ maintenance queue
```

---

## 7. Key UI Screens

### Home

Keep it visually simple. Property imagery should dominate.

Suggested content:

- Hero + search: area, move-in, stay duration;
- selected properties;
- Essential / Comfort / Plus introduction;
- concise benefits centered on the three primary promises: Speed, Trust, and Safety.

### Explore

Property cards should emphasize:

- cover image;
- property/unit name;
- area;
- tier;
- private/shared availability;
- starting monthly price;
- available inventory.

Mobile filters should preferably use a Sheet/Drawer/Bottom Sheet pattern.

### Property Detail

This is the main sales page.

Include:

- strong gallery;
- Maskan unit code/name;
- area/location;
- tier;
- male/female unit indicator;
- availability;
- starting/all-inclusive price messaging;
- amenities;
- room/bed options;
- original vs partition room where relevant;
- sticky mobile CTA.

### Booking

POC steps:

1. stay: move-in + duration;
2. resident details;
3. price/deposit summary;
4. dummy payment;
5. confirmation.

Pricing must be derived from stored pricing rules/booking snapshot, not scattered hard-coded UI values.

### My Maskan

Dashboard should surface:

- current unit/room/bed;
- next payment;
- deposit;
- contract expiry;
- cleaning schedule/info;
- maintenance;
- support;
- house rules;
- Unit Representative if applicable.

### Admin Dashboard

Core POC KPIs:

- total properties;
- total beds;
- occupancy;
- monthly revenue;
- available beds;
- outstanding payments;
- open maintenance requests;
- expiring contracts.

Demo KPIs must be labeled/understood as illustrative data.

---

## 8. Domain / Data Model

Canonical inventory hierarchy:

```text
Area
└── Property
    ├── Property Images
    ├── Amenities
    └── Bookable Inventory
        ├── Room
        │   └── Bed/Slot
        └── Complete Family Unit
            └── Booking
                ├── Contract
                └── Payments
```

Resident data lives in `profiles`. Maintenance links back to the relevant resident/property and optionally room/bed.

### Bookable inventory rule

For shared housing, the smallest bookable inventory unit is a bed/slot. A private room can internally have exactly one slot. A family apartment is also represented by one full-unit slot in the current POC so booking and availability remain consistent, but it must carry a `full_unit` kind and a whole-unit price basis. It must never be displayed or reported as a bed.

---

## 9. Supabase Schema

The initial SQL lives at:

```text
supabase/schema.sql
```

Current main tables:

- `areas`
- `properties`
- `rooms`
- `beds`
- `profiles`
- `bookings`
- `contracts`
- `payments`
- `maintenance_requests`
- `property_images`
- `amenities`
- `property_amenities`
- `pricing_rules`

Current enum concepts include:

- `product_type`: `essential | comfort | plus`
- `unit_gender`: `male | female`
- `bed_status`: `available | reserved | occupied | maintenance`

The next schema migration must add the rental semantics now represented in local TypeScript data:

- `rental_model`: `shared_housing | family_apartment`;
- `inventory_kind`: `private_room | shared_bed | full_unit`;
- `price_basis`: `resident_space | room | full_unit`;
- optional family-unit bedroom and bathroom counts;
- a constraint requiring family apartments to use `full_unit` inventory and whole-unit pricing.

`product_type` remains independent from `rental_model`: Essential, Comfort, and Plus describe the service standard, not the occupancy model.

### Important schema behavior

A booking stores a **snapshot** of `monthly_price`, `deposit_amount`, and `price_basis`. Do not rely solely on the current room or unit price after a booking has been created; historical agreements must remain stable when pricing changes.

### Schema evolution

The current schema is POC-level and will need migrations before production. Prefer Supabase migrations for future changes rather than manually editing a live production database.

Potential future additions include:

- explicit property status enum;
- booking/contract/payment status enums;
- cleaning schedules;
- support tickets distinct from maintenance;
- resident matching preferences;
- area assignment for staff;
- unit representative assignment;
- property economics / property score;
- audit log;
- notifications;
- corporate accounts;
- managed-property owner entities.

Do not add these prematurely unless required by the next implemented feature.

---

## 10. Supabase Storage

Intended buckets:

```text
properties      public or safely readable property marketing images
avatars         controlled user avatars
maintenance     private maintenance evidence/uploads
identity-docs   private identity documents
contracts       private resident contracts
```

Never expose identity documents or contracts through unrestricted public buckets.

Store database paths/keys rather than assuming permanent public URLs for private files.

---

## 11. Authentication and Authorization

Use Supabase Auth.

### Public users

Can browse public properties, rooms, pricing, availability, amenities, and public property images.

### Resident

Can read/update only allowed portions of their profile and access only their own:

- bookings;
- contracts;
- payments;
- maintenance requests/uploads;
- stay details;
- approved common-area camera feeds for the resident's own active unit only.
- their own private support conversation;
- the group chat for their own active unit only.

### Staff / Area Manager / Admin

Admin access must be controlled through server-side authorization/RLS rather than merely hiding UI routes.

Area managers should eventually be scoped to assigned areas/properties.

### Camera authorization

Camera access follows an explicit five-level demo hierarchy:

1. resident: approved entrance and shared-area feeds for the resident's active unit;
2. Unit Representative: additional common-area feeds for the same unit;
3. operations staff: operational feeds for properties in the staff member's assigned area;
4. area manager: all approved common-area feeds in the assigned area;
5. administrator: approved feeds across the managed portfolio.

Bedrooms, bathrooms, and all private spaces are always excluded. Production camera tokens/stream URLs must be short-lived and issued server-side after authorization. Access must be auditable and revocable; never rely on hidden navigation or client filtering for enforcement.

### Chat authorization

Private support conversations are keyed to the authenticated resident and are visible only to that resident and authorized operations roles. Unit-chat conversations are keyed to the active property; the server must verify the resident's active booking before every read, subscription, and write. A client-supplied property ID is never sufficient authorization.

The local POC stores a short signed conversation history in an HTTP-only cookie to demonstrate the cycle. Production must move messages to database tables with RLS, retention and moderation controls, rate limiting, and Realtime subscriptions. Maintenance requests remain separate records with their own status and audit history.

Chat supports up to three attachments per message. Accepted images are JPEG, PNG, and WebP up to 5 MB each; accepted videos are MP4 and WebM up to 25 MB each. Both the client and server check type and size, while the server also checks the binary file signature, generates the stored filename, and authorizes every media read against the support account or active unit scope. Demo media is stored under `.demo-chat-media/` and is intentionally excluded from version control. Production must use private Supabase Storage buckets, signed access, malware scanning, lifecycle cleanup, and database-backed attachment records.

### RLS

RLS is mandatory before treating Supabase integration as secure. The current schema file is a structural starting point; implement and test policies as part of the Supabase integration pass.

Do not ship service-role keys to the browser.

---

## 12. Data Fetching / Next.js Guidance

Prefer Next.js server capabilities where they simplify security and data access.

General direction:

- Server Components for read-heavy pages where interactive client state is not needed;
- Client Components only where interaction/browser APIs require them;
- server-side Supabase client for protected reads/writes;
- Route Handlers or Server Actions where appropriate for mutations;
- avoid turning the entire application into client components;
- use URL search params for shareable Explore filters where practical.

Do not over-engineer caching for the POC. Correctness and clarity come first.

---

## 13. Dummy Data Strategy

The POC should eventually seed realistic data into Supabase rather than depend permanently on static JSON/TS objects.

Target portfolio:

- 18 properties;
- eight Greater Cairo areas;
- 12 shared-housing properties and 6 complete family apartments;
- 91 illustrative booking slots in the current local dataset (shared beds plus full units);
- Essential, Comfort, Plus;
- male/female shared units and family-only complete apartments;
- private/shared rooms and full units;
- original/partition rooms;
- multiple duration/pricing rules;
- residents and bookings;
- active/expiring contracts;
- paid/pending/late payment examples;
- maintenance requests across workflow states.

Approximate property distribution:

- New Cairo: 5
- Nasr City: 2
- Heliopolis: 3
- Shorouk: 2
- Obour: 2
- 6th of October: 2
- Sheikh Zayed: 1
- Maadi: 1

This location limit is a current demo/pilot-data decision, not a product boundary. The target architecture and brand remain Egypt-wide.

Dummy data must be clearly non-production/demo data.

---

## 14. Current Repository State

At the time this document was created, the repository contains an early POC shell with:

- Next.js App Router;
- TypeScript;
- Tailwind CSS;
- Supabase client bootstrap;
- initial Supabase SQL schema;
- a centralized local illustrative Greater Cairo portfolio of 18 properties: 12 shared residences and 6 complete family apartments;
- a property-first Home experience with search entry points;
- interactive Explore filters for rental model, area, gender where relevant, tier, room/full-unit type, price, and availability;
- Property Details with an interactive keyboard-accessible image lightbox, zoom/navigation controls, amenities, room/bed/full-unit inventory, and explicit price-basis context;
- an interactive demo booking flow with price snapshots and a separately displayed deposit;
- My Maskan resident views for stay information, payments, deposit, contract, support, cleaning, and maintenance workflow;
- an operations dashboard covering occupancy, collections, outstanding payments, contracts, clusters, properties, and maintenance.

Current implemented routes include:

```text
/
/explore
/property/[slug]
/book/[bedId]
/login
/register
/app-info
/my-maskan
/my-maskan/payments
/my-maskan/maintenance
/my-maskan/contract
/my-maskan/chat
/my-maskan/support
/profile
/cameras (compatibility redirect to the embedded camera section)
/admin
```

### Demo authentication and closed cycle

The local POC includes a functional, cookie-based demo authentication layer so the entire presentation can be tested without a configured Supabase project. Demo sessions are signed and stored in HTTP-only cookies. This layer is explicitly non-production and must be replaced by Supabase Auth before deployment with real resident data.

Arabic (`ar`) is the default locale. A user's preferred language is part of the demo session and the future `profiles` record. Switching language updates both the locale cookie and the active demo session. English (`en`) remains fully available.

The current interface is nationally positioned for Egypt and uses natural Egyptian Arabic. The current demo inventory is intentionally limited to Greater Cairo for operational focus; this is not the limit of the brand or product. Arabic typography uses the Cairo font. Shared form controls use styled input/textarea primitives and Radix Select for consistent keyboard-friendly menus in both RTL and LTR layouts.

The home search uses controlled rental-model, area, move-in-date, and stay-length fields. On mobile, the search surface visually blends with the hero, Radix Select triggers are not nested inside labels, touch targets are at least 44px high, and the native date input is allowed to open its picker without a duplicate programmatic `showPicker()` call. One reset action clears all selections without reloading the page.

The login page displays these test accounts and provides an explicit **Demo sign in / دخول ديمو** action:

| Role | Email | Password | Default language |
| --- | --- | --- | --- |
| Resident | `resident@maskan.demo` | `Maskan123!` | Arabic |
| Unit Representative | `representative@maskan.demo` | `Maskan123!` | Arabic |
| Operations Staff | `staff@maskan.demo` | `Maskan123!` | Arabic |
| Area Manager | `manager@maskan.demo` | `Maskan123!` | Arabic |
| Admin | `admin@maskan.demo` | `Maskan123!` | English |

Demo role behavior:

- residents access booking and My Maskan;
- Unit Representatives remain residents and receive only a limited coordination indicator;
- operations staff access operational inventory and maintenance but not the finance-focused cards;
- the Area Manager is scoped to the assigned Nasr City cluster;
- the Admin sees the complete illustrative portfolio;
- resident bookings, maintenance requests, private support messages, and unit-chat messages are persisted in signed demo cookies;
- private support messages become visible to operations after switching accounts, while unit chat remains scoped to residents of that unit.
- resident chat is also available through a persistent floating launcher with support and same-unit conversations; camera feeds are embedded in My Maskan and the operations dashboard rather than exposed as a navigation tab.

The full local demo cycle is:

```text
Explore
→ Select a room/bed or complete family unit
→ Sign in or register a demo resident
→ Confirm a demo booking
→ View the stay, payment, deposit, and contract in My Maskan
→ Submit a maintenance request
→ Sign in as staff/manager/admin
→ Observe the booking and maintenance activity in operations
```

`DEMO_AUTH_SECRET` should be set for a shared demo deployment. The local fallback exists only to make the POC runnable without environment setup. Demo passwords are intentionally public and must never be reused for real accounts.

The UI currently uses local illustrative data for immediate rendering. **The next integration phase should move application data into Supabase.**

Do not mistake current local data for the final architecture.

---

## 15. Recommended Implementation Order From Here

1. Verify/install shadcn/ui properly and establish reusable design tokens/components.
2. Create Supabase project/environment configuration.
3. Convert the schema into clean migrations and add indexes/constraints where required.
4. Add seed data for areas/properties/rooms/beds/full units/images/amenities/pricing.
5. Replace local Explore/Property data with Supabase reads.
6. Implement Supabase Auth and `profiles` creation.
7. Implement booking flow and price snapshot logic.
8. Add resident My Maskan data from authenticated user.
9. Implement payments as POC/dummy records (no real payment gateway yet unless separately decided).
10. Implement maintenance creation/status workflow + private uploads.
11. Implement admin data views and CRUD needed for the demo.
12. Add contracts and private contract access.
13. Add RLS policies and authorization tests.
14. Polish responsive UI, loading/empty/error states, and investor demo path.
15. Run production build and end-to-end demo walkthrough.

---

## 16. Non-Goals for the Current POC

Unless explicitly added later, do not spend early POC time on:

- real payment-gateway integration;
- production accounting;
- complex ERP functionality;
- native mobile apps;
- advanced recommendation AI;
- automated legal-document generation;
- full owner portal;
- complex corporate-housing administration;
- production notification infrastructure;
- premature microservices.

The POC should prove the business/product experience first.

---

## 17. Engineering Conventions

- TypeScript strictness should remain enabled.
- Prefer clear domain names over generic names.
- Avoid `any` unless unavoidable and documented.
- Keep business rules out of presentation-only components.
- Centralize formatting for money/dates.
- Treat currency initially as EGP, but avoid making future multi-currency impossible where easy.
- Use stable property codes such as `MSK-NC-001` for operational display; database IDs remain UUIDs.
- Use slugs for public property URLs.
- Validate server mutations, not only client forms.
- Use semantic accessible HTML and keyboard-friendly controls.
- Use Next `<Image>` for managed images where appropriate.
- Optimize images without sacrificing the property-first visual quality.
- Add empty/loading/error states as real product states.

---

## 18. Environment Variables

Expected public Supabase values are represented in `.env.example`.

Typical local file:

```text
.env.local
```

Never commit private secrets. In particular, never expose the Supabase service-role key through `NEXT_PUBLIC_*` variables.

---

## 19. Documentation Contract for AI Coding Agents

Before making a major change, an AI agent should read:

1. `docs/BUSINESS.md`
2. `docs/TECHNICAL.md`
3. `README.md`
4. the relevant existing implementation files.

Rules:

- Do not change a settled business rule silently.
- If implementation conflicts with these docs, identify the conflict and either fix the implementation or deliberately update the docs.
- Keep the POC focused; do not add large features merely because they are technically interesting.
- Preserve Next.js + TypeScript + pnpm + Tailwind + shadcn/ui + Supabase unless the owner explicitly changes the stack.
- Treat apartment photography and mobile experience as first-class requirements.
- After meaningful architecture/business changes, update the appropriate reference document.

---

## 20. Definition of a Successful POC

A stakeholder should be able to open the application and understand the Maskan model without a long verbal explanation, then complete or observe this story:

```text
Find a suitable Maskan home
→ inspect the apartment and available space
→ understand monthly price/deposit/stay
→ create/confirm a demo booking
→ see resident services in My Maskan
→ switch to Admin and see how Maskan operates the portfolio
```

The experience should look credible enough to support an investor/business discussion while remaining explicit that the displayed operating data is illustrative.
