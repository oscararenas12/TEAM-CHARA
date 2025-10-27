import Navbar from "@/components/shared/Navbar"

export default function ProfileLayout({
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
