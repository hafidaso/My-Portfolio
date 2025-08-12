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
    "Data Analysis",
    "Machine Learning Engineer",
    "Data Scientist",
    "Python Programming",
    "Statistical Analysis",
    "Predictive Modeling",
    "Business Intelligence",
    "Data Engineering",
    "Deep Learning"
  ],
  authors: [{ name: "Hafida Belayd", url: "https://hafida-belayd.netlify.app" }],
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
    languages: {
      'en-US': '/en-US',
    },
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
        alt: 'Hafida Belayd - Data Analyst & AI Specialist Portfolio',
        type: 'image/png',
      },
    ],
    countryName: 'Morocco',
    emails: ['hafidabelaidagnaoui@gmail.com'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hafida Belayd - Data Analyst & AI Specialist',
    description: 'Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization.',
    images: ['/og-image.png'],
    creator: 'hafidaso',
    site: 'hafidaso',
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
  other: {
    'application-name': 'Hafida Portfolio',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Hafida Portfolio',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#f97316',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#f97316',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization." />
        <meta name="keywords" content="Hafida Belayd, Data Analyst, AI Specialist, Python Developer, Machine Learning, Power BI, Data Science, Morocco, Data Visualization, Artificial Intelligence, Portfolio" />
        <meta name="author" content="Hafida Belayd" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="generator" content="Next.js" />
        
        {/* LinkedIn-specific meta tags */}
        <meta property="og:title" content="Hafida Belayd - Data Analyst & AI Specialist" />
        <meta property="og:description" content="Hafida Belayd is a Data Analyst and AI Specialist based in Morocco. Expert in Python, Machine Learning, Power BI, and data visualization." />
        <meta property="og:image" content="https://hafida-belayd.netlify.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Hafida Belayd - Data Analyst & AI Specialist Portfolio" />
        <meta property="og:url" content="https://hafida-belayd.netlify.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Hafida Belayd Portfolio" />
        <meta property="og:locale" content="en_US" />
        
        {/* Additional LinkedIn meta tags */}
        <meta name="linkedin:owner" content="hafidaso" />
        <meta name="linkedin:card" content="summary_large_image" />
        
        <meta name="theme-color" content="#f97316" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hafida Portfolio" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="canonical" href="https://hafida-belayd.netlify.app" />
        <link rel="alternate" type="application/rss+xml" title="Hafida Belayd Blog RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Hafida Belayd Blog Atom" href="/atom.xml" />
      </head>
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