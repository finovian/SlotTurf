# SlotTurf

**Turf booking platform for local sports venues — built as a PWA for instant, friction-free reservations.**

> Book a turf slot in under 60 seconds. No calls, no WhatsApp back-and-forth.


---

## Features

- Browse and filter local turf venues by location, sport, and slot availability
- Real-time slot availability — no double bookings
- Razorpay-powered payments with instant confirmation
- PWA — installable on mobile, works offline for browsing
- Venue owner dashboard to manage slots, pricing, and bookings
- Booking history and cancellation management

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Data Fetching | TanStack Query |
| Payments | Razorpay |
| Package Manager | pnpm |
| Deployment | Vercel |

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/finovian/slotturf
cd slotturf

# Install dependencies (pnpm only)
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run locally
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
# Backend
NEXT_PUBLIC_API_URL=your_backend_url_here

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> Never commit `.env.local`. `RAZORPAY_KEY_SECRET` is server-side only — never prefix with `NEXT_PUBLIC_`.

---

## Project Structure

```
slotturf/
├── app/
│   ├── page.tsx                  # Home / venue discovery
│   ├── venues/
│   │   ├── [id]/                 # Venue detail + slot picker
│   │   └── page.tsx              # Venue listing
│   ├── bookings/
│   │   └── page.tsx              # User booking history
│   ├── dashboard/                # Venue owner dashboard
│   └── api/
│       └── payment/              # Razorpay order creation (server-side)
├── components/
│   ├── ui/                       # shadcn/ui base components
│   ├── venue/                    # Venue cards, slot grid
│   └── booking/                  # Booking flow, confirmation
├── store/
│   └── useBookingStore.ts        # Zustand booking state
├── lib/
│   ├── api.ts                    # TanStack Query API calls
│   └── razorpay.ts               # Payment helpers
└── types/
    └── index.ts                  # Shared TypeScript types
```

---

## Payment Flow

```
User selects slot
    → POST /api/payment/create-order  (server, creates Razorpay order)
    → Razorpay checkout modal opens
    → On success: verify signature server-side
    → Booking confirmed + slot locked
```

---

## Roadmap

- [ ] SMS / WhatsApp booking confirmation
- [ ] Recurring slot bookings (weekly)
- [ ] Multi-sport venue support
- [ ] Venue analytics dashboard
- [ ] Native app (React Native / Expo)

---

## License

MIT
