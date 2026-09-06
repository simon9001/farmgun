# Farm with Irene

Marketing site and client portal for **Farm with Irene**, an agricultural
consultancy in Kenya specialising in onion and garlic production.

Visitors can browse services and prices, read field guides, check market crop
prices, and book a paid consultation (M-Pesa). Signed-in clients get a dashboard
for their bookings; Irene gets an admin panel for content, bookings and partners.

---

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 19 |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| State / data | Redux Toolkit + RTK Query, redux-persist |
| Forms | React Hook Form + Zod |
| Routing | React Router 7 |
| Icons | lucide-react |
| Animation | Framer Motion (side nav and modals only) |
| Hosting | Vercel |

---

## Running it

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the production build
npm run lint
```

The frontend talks to a separate backend API; its base URL lives in
[`src/apiDomain/apiDomain.js`](src/apiDomain/apiDomain.js).

---

## Things you will want to edit

**[`src/config/site.js`](src/config/site.js)** is the single source of truth for
business details — phone number, email, WhatsApp link and social profiles.
Change it there and every page updates.

The same file has a `FACTS` block for claims only Irene can confirm:

```js
export const FACTS = {
  basedIn: null,       // e.g. "Nyandarua County, Kenya"
  yearsFarming: null,  // e.g. 8
  hours: null,         // e.g. "Mon–Sat, 8am–6pm"
};
```

These are `null` on purpose. Any entry left as `null` is simply not rendered,
rather than showing an invented number. Fill them in to switch them on.

**Hero photograph:** [`src/pages/Home.jsx`](src/pages/Home.jsx) imports
`src/assets/002.jpeg`. Swap that import to change the image at the top of the
site.

---

## Design system

One light theme. There is no dark mode and no theme toggle.

All design tokens live in the `@theme` block at the top of
[`src/index.css`](src/index.css):

| Token | Value | Used for |
| --- | --- | --- |
| `--color-ink` | `#132a1e` | Body text — a green-black, not grey |
| `--color-field` | `#1f4d33` | Primary green: buttons, headers, links |
| `--color-bulb` | `#9e2b46` | Accent, taken from a Red Creole onion. Used sparingly |
| `--color-husk` | `#f1f3ee` | Page background |
| `--color-rule` | `#dce0d7` | Hairline borders |
| `--color-quiet` | `#57685c` | Secondary text |

Typefaces are **Source Serif 4** for headings and **IBM Plex Sans** for
everything else, loaded from Google Fonts in [`index.html`](index.html).

Reusable classes, also in `index.css`: `.shell` (page gutter), `.section`,
`.section-head`, `.panel`, `.btn` + variants, `.field-input`, `.rail`
(snapping horizontal scroller), and the `.t-*` type scale.

Shared page pieces — `PageHeader`, `LoadingState`, `ErrorState`, `EmptyState`,
`Thumb` — live in
[`src/components/common/Page.jsx`](src/components/common/Page.jsx).

> The admin screens still carry `dark:` Tailwind variants from the original
> template. They are harmless: `.dark` is never applied to `<html>`, so those
> variants never match. The `@custom-variant dark` line in `index.css` only
> exists so those files keep compiling.

---

## Booking flow

`/booking` is a **public** route. A visitor can choose a service, pick a date
and see real availability without an account. The sign-in prompt happens at
submit: the form is saved to `sessionStorage` under
`farmwithirene:bookingDraft`, the visitor signs in or registers, and is returned
to `/booking` with their selection restored.

Creating the booking itself still requires authentication — that is enforced by
the backend, not the router.

---

## Project layout

```
src/
├── config/site.js         # business details and editable facts
├── components/
│   ├── common/Page.jsx    # PageHeader, loading/error/empty states, Thumb
│   ├── Header.jsx  SideNav.jsx  Footer.jsx  Layout.jsx
│   ├── About.jsx  Contact.jsx
│   ├── Admin/             # admin modals
│   └── ui/                # shadcn/ui primitives
├── pages/                 # one file per route
├── features/
│   ├── Api/               # RTK Query endpoints
│   └── Slice/AuthSlice.js
└── index.css              # design tokens + shared classes
```

Signed-in and admin screens are lazy-loaded in
[`src/App.jsx`](src/App.jsx) so they stay out of the first-load bundle.
