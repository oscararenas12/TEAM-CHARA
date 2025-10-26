import Navbar from "@/components/shared/Navbar"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Navbar />
    </>
  )
}
