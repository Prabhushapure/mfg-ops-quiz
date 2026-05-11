import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safety Scramble — Industrial Safety Quiz",
  description:
    "A gamified Snakes & Ladders quiz on electrical safety for industrial workers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-navy-950 text-white font-body antialiased">
        {children}
      </body>
    </html>
  );
}
