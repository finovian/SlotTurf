import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Toast from "@/components/Toast";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "Turf Flow",
  description: "Manage your turf bookings with ease.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  icons: {
    icon: "/slotturffavicon.svg",
    apple: "/slotturffavicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toast />
        <PWAInstallBanner />
      </body>
    </html>
  );
}
