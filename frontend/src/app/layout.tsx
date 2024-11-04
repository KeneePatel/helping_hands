'use client';
import Footer from "@/components/footer/footer";
import NavBar from "@/components/navbar/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Roboto as FontSans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../../Auth/AuthContext';

const fontSans = FontSans({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AuthProvider>
        <html lang="en">
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased",
                fontSans.variable,
            )}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Toaster />
          <NavBar />
          {children}
          <Footer />
        </ThemeProvider>
        </body>
        </html>
      </AuthProvider>
  );
}
