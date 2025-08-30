import Footer from "@/components/Footer";
import BackgroundAudio from "@/components/BackgroundAudio";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextUIProvider } from "@/components/NextUIProvider";
import JsonLd from "@/components/JsonLd";
import CustomCursor from "@/components/CustomCursor";
import BackToTop from "@/components/BackToTop";
import HydrationErrorBoundary from "@/components/HydrationErrorBoundary";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Hafida Belayd — Data Analyst & AI Specialist",
    default: "Hafida Belayd — Data Analyst & AI Specialist | Portfolio",
  },
  description: "Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.",
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
    title: 'Hafida Belayd — Data Analyst & AI Specialist',
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
    siteName: 'Hafida Belayd Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hafida Belayd — Data Analyst & AI Specialist Portfolio',
        type: 'image/png',
      },
    ],
    countryName: 'Morocco',
    emails: ['hafidabelaidagnaoui@gmail.com'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hafida Belayd — Data Analyst & AI Specialist',
    description: 'Hafida Belayd — Data Analyst & AI Specialist. Developer & Designer | Expert in Python, Machine Learning, and Data Visualization. Based in Morocco.',
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
    google: process.env.GOOGLE_VERIFICATION_CODE || '',
    yandex: process.env.YANDEX_VERIFICATION_CODE || '',
    yahoo: process.env.YAHOO_VERIFICATION_CODE || '',
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
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
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
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="canonical" href="https://hafida-belayd.netlify.app" />
        <link rel="alternate" type="application/rss+xml" title="Hafida Belayd Blog RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Hafida Belayd Blog Atom" href="/atom.xml" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Y5TP52QQ98"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y5TP52QQ98');
          `,
        }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextUIProvider>
            <HydrationErrorBoundary>
              <BackgroundAudio />
              <div className="min-h-screen bg-background text-foreground">
                <CustomCursor />
                <Navbar />
                <main className="py-8 px-4 md:px-6 mx-auto max-w-7xl">
                  {children}
                </main>
                <Footer />
                <BackToTop />
              </div>
            </HydrationErrorBoundary>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}