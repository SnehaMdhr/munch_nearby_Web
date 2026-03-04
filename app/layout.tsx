import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import ToastProvider from "./_components/ToastPovider";
import "leaflet/dist/leaflet.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MunchNearby",
  description:
    "Discover nearby restaurants and share your reviews with MunchNearby!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>

        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
