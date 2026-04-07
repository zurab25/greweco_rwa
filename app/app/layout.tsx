import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WalletContextProvider from "@/components/WalletContextProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreWeCo | RWA MRV Engine",
  description: "GreWeCo dashboard for on-chain plantation and MRV records",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-white">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
