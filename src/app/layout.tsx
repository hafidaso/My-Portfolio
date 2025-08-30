import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextUIProvider } from "@/components/NextUIProvider";
import JsonLd from "@/components/JsonLd";
import CustomCursor from "@/components/CustomCursor";
import BackToTop from "@/components/BackToTop";
import HydrationErrorBoundary from "@/components/HydrationErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import BrowserCompatibility from "@/components/BrowserCompatibility";
import ErrorHandlingInit from "@/components/ErrorHandlingInit";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import CriticalResourcePreloader from "@/components/CriticalResourcePreloader";
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
  authors: [{ name: "Hafida Belayd", url: "https://hafida-belayd.me/" }],
  creator: "Hafida Belayd",
  publisher: "Hafida Belayd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hafida-belayd.me/'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hafida-belayd.me/',
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
        
        {/* Critical resource preloading */}
        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/icons/icon-192x192.png" as="image" />
        <link rel="preload" href="/icons/icon-512x512.png" as="image" />
        <link rel="preload" href="/og-image.png" as="image" />
        
        {/* Font preloading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* External service preconnect */}
        <link rel="preconnect" href="https://github-readme-stats.vercel.app" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//github-readme-stats.vercel.app" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* PWA manifest and icons */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* SEO and social */}
        <link rel="canonical" href="https://hafida-belayd.me/" />
        <link rel="alternate" type="application/rss+xml" title="Hafida Belayd Blog RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="Hafida Belayd Blog Atom" href="/atom.xml" />
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for initial paint */
            body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            *{box-sizing:border-box}
            .min-h-screen{min-height:100vh}
            .container{width:100%;margin:0 auto;padding:0 1rem}
            @media(min-width:640px){.container{max-width:640px}}
            @media(min-width:768px){.container{max-width:768px}}
            @media(min-width:1024px){.container{max-width:1024px}}
            @media(min-width:1280px){.container{max-width:1280px}}
            .bg-background{background-color:rgb(255 255 255)}
            .dark .bg-background{background-color:rgb(3 7 18)}
            .text-foreground{color:rgb(3 7 18)}
            .dark .text-foreground{color:rgb(250 250 250)}
            .transition-colors{transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out}
            .animate-spin{animation:spin 1s linear infinite}
            @keyframes spin{to{transform:rotate(360deg)}}
          `
        }} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ServiceWorkerRegistration />
        <PerformanceMonitor />
        <CriticalResourcePreloader />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NextUIProvider>
            <ErrorBoundary>
              <BrowserCompatibility>
                <HydrationErrorBoundary>
                  <ErrorHandlingInit />
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
              </BrowserCompatibility>
            </ErrorBoundary>
          </NextUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}