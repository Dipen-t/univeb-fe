import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// ❌ REMOVE: import { WebSocketProvider } ...

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Univibe",
  description: "Listen together",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
         {/* ❌ REMOVE: <WebSocketProvider> wrapper here */}
         {children}
      </body>
    </html>
  );
}