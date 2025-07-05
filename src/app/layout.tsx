import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextUIProvider } from "@/components/NextUIProvider";
import JsonLd from "@/components/JsonLd";
import CustomCursor from "@/components/CustomCursor";
import ParticleBackground from "@/components/ParticleBackground";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Hafida Belayd - Data Analyst & AI Specialist",
    default: "Hafida Belayd - Data Analyst & AI Specialist | Portfolio",
  },
  description: "Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization. View projects, blog posts, and connect.",
  keywords: [
    "Hafida Belayd",
    "Data Analyst",
    "AI Specialist",
    "Python Developer",
    "Machine Learning",
    "Power BI",
    "Data Science",
    "Morocco",
    "Data Visualization",
    "Artificial Intelligence",
    "Portfolio",
    "Data Analysis"
  ],
  authors: [{ name: "Hafida Belayd" }],
  creator: "Hafida Belayd",
  publisher: "Hafida Belayd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hafida-belayd.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hafida-belayd.netlify.app',
    title: 'Hafida Belayd - Data Analyst & AI Specialist',
    description: 'Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization.',
    siteName: 'Hafida Belayd Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hafida Belayd - Data Analyst & AI Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hafida Belayd - Data Analyst & AI Specialist',
    description: 'Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization.',
    images: ['/og-image.png'],
    creator: '@hafidaso',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextUIProvider>
            <div className="min-h-screen bg-background text-foreground">
              <ParticleBackground />
              <CustomCursor />
              <Navbar />
              <main className="py-8 px-4 md:px-6 mx-auto max-w-7xl">
                {children}
              </main>
              <Footer />
            </div>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
