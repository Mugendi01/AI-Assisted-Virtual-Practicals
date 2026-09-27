import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Lab - Science Practical Learning Platform",
  description:
    "AI-assisted science practical learning platform for students in low-resource school environments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-900 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
