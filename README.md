# Student Mart
Project Starbound at CSULB

We are a dedicated team of college students who understood firsthand the challenges of buying and selling items on campus. That's why, in 2024, we began development on Student Mart to create a trusted marketplace exclusively for CSULB students. Through our platform, you can list items for sale, connect with buyers and sellers, and complete transactions safely within the campus community.

## Features

- **Campus-Only Marketplace**: Exclusive platform for verified CSULB students with @student.csulb.edu emails.
- **Real-Time Messaging**: Direct communication between buyers and sellers with quick question templates.
- **User Profiles & Ratings**: Build trust through seller ratings and transaction history.
- **Smart Search & Categories**: Find items quickly with search and category filtering (Electronics, Books, Clothing, Furniture).
- **Image Uploads**: Showcase items with multiple photos per listing.
- **Modern UI/UX**: Sleek and intuitive interface with loading spinners and toast notifications.

## Technologies Used

This project employs a modern web development stack and leverages powerful libraries and frameworks to create a seamless user experience:

### Frontend:
- **Next.js 16**: Framework for React-based web applications with App Router and server-side rendering.
- **React 19**: Library for building interactive and component-based user interfaces.
- **TypeScript 5.6**: Strict syntactic superset of JavaScript for type-safe development.
- **CSS**: Custom stylesheets for consistent and visually appealing UI.
- **Zustand**: Lightweight state management library for managing application state.

### Backend:
- **Supabase**: Backend-as-a-service platform for authentication, database management, and storage.
  - **PostgreSQL**: Relational database for storing users, items, messages, and ratings.
  - **Auth**: Email/password authentication with password reset flow.
  - **Storage**: Cloud storage for item images.
  - **Realtime**: Live updates for messaging.
  - **RPC Functions**: Custom database functions for profile updates and item management.

### Deployment:
- **Vercel**: Hosting platform for Next.js applications.
- **GoDaddy**: Domain name management.

### Development Tools:
- **ESLint**: Static code analysis tool for identifying problematic patterns.
- **Supabase CLI**: For managing Supabase projects and migrations.

## Authors

**Oscar Arenas** - Backend Engineer
[Add bio here]
[LinkedIn](#)

**Warissa Hossain** - Frontend Engineer
[Add bio here]
[LinkedIn](#)

**Min Hein** - Frontend Engineer
[Add bio here]
[LinkedIn](#)

**Angel Rivera** - Backend Engineer
[Add bio here]
[LinkedIn](#)

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
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

We have intentionally chosen to use no license for this repository.

As exclusive copyright, the code within this repository is the intellectual property of the Student Mart development team and cannot be copied, modified, or distributed without explicit written permission. This license ensures we retain full control over the use and distribution of the code, allowing us to market the product in the future without legal complications.

For inquiries, please contact any of the developers via our public contacts.

## Disclaimer

This repository is intended to showcase the development process and provide insights into the technologies and design principles behind Student Mart. It is not configured for public deployment or use. If you're interested in learning more about the project, feel free to explore the code and reach out with any questions.
