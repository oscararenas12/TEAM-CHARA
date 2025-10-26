import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect root to login
  redirect('/login')
}
