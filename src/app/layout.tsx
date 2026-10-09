import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import CompareFloatingBar from "@/components/products/CompareFloatingBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NextCart • Next.js Redux E-Commerce & Learning Hub",
  description:
    "A modern Next.js App Router e-commerce application powered by Redux Toolkit for state management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} font-sans min-h-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}
      >
        <ReduxProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <CompareFloatingBar />
          <Footer />
          <Toast />
        </ReduxProvider>
      </body>
    </html>
  );
}
