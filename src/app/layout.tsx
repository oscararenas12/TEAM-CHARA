import type { Metadata } from "next";
import "./globals.css";
import "./(marketplace)/styles.css";
import SessionMonitor from "@/components/SessionMonitor";

export const metadata: Metadata = {
  title: "Student Mart - CSULB Marketplace",
  description: "Buy and sell items with verified CSULB students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionMonitor />
        {children}
      </body>
    </html>
  );
}
