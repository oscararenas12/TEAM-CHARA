# Student Mart

A marketplace platform for CSULB students to buy and sell items.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend (authentication, database, real-time)
- **CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/oscararenas12/TEAM-CHARA.git
cd TEAM-CHARA
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### `npm run dev`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production in the `.next` folder.

### `npm start`
Runs the production build.

### `npm run lint`
Runs ESLint to check code quality.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   ├── (marketplace)/     # Marketplace pages (home, item details)
│   ├── (profile)/         # Profile pages
│   ├── messages/          # Messaging page
│   └── api/               # API routes
├── components/            # Shared components
├── lib/                   # Utilities (Supabase clients)
├── types/                 # TypeScript types
└── assets/                # Images and static files
```

## Authentication

Only CSULB students with `@student.csulb.edu` email addresses can sign up.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)


Add real user profile integration from Supabase

- Create useUserProfile hook to fetch user data from profiles table
- Update profile page to show real user name, email, rating, and stats
- Add user display to marketplace, cart, and messages pages
- Replace mock user data with Supabase auth and profiles