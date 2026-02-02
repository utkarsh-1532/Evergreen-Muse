import type { Metadata } from "next";
import { FirebaseClientProvider } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter, Playfair_Display } from 'next/font/google';
import { FloatingNav } from "@/components/ui/FloatingNav";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});


export const metadata: Metadata = {
  title: "Evergreen Muse",
  description: "A personal growth platform for habits, learning, and creative journaling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          playfair.variable,
          "selection:bg-primary selection:text-primary-foreground"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            {/* 1. Static Layer: Navigation (Fixed, GPU accelerated) */}
            <FloatingNav />
            
            {/* 2. Scrollable Layer: Content */}
            <main className='relative z-0 min-h-screen flex flex-col'>
              {children}
            </main>
            
            <Toaster />
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
