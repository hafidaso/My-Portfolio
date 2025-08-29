import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { NextUIProvider } from "@/components/NextUIProvider";
import JsonLd from "@/components/JsonLd";
import CustomCursor from "@/components/CustomCursor";
import BackToTop from "@/components/BackToTop";
import HydrationErrorBoundary from "@/components/HydrationErrorBoundary";
import PerformanceHead from "@/components/PerformanceHead";
import ClientPerformanceWrapper from "@/components/ClientPerformanceWrapper";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance optimizations */}
        <PerformanceHead
          preloadImages={[
            '/og-image.png',
            '/icons/icon-192x192.png',
            '/icons/icon-512x512.png',
            '/assets/hafida.jpeg'
          ]}
          preloadFonts={[
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
          ]}
          preconnectDomains={[
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://github-readme-stats.vercel.app',
            'https://res.cloudinary.com'
          ]}
          dnsPrefetch={[
            '//fonts.googleapis.com',
            '//fonts.gstatic.com',
            '//github-readme-stats.vercel.app',
            '//res.cloudinary.com'
          ]}
          criticalCSS={`
            /* Critical CSS for above-the-fold content */
            body { 
              margin: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
              -webkit-font-smoothing: antialiased; 
              -moz-osx-font-smoothing: grayscale; 
            }
            * { box-sizing: border-box; }
            .min-h-screen { min-height: 100vh; }
            .container { 
              width: 100%; 
              margin-left: auto; 
              margin-right: auto; 
              padding-left: 1rem; 
              padding-right: 1rem; 
            }
            @media (min-width: 640px) { .container { max-width: 640px; } }
            @media (min-width: 768px) { .container { max-width: 768px; } }
            @media (min-width: 1024px) { .container { max-width: 1024px; } }
            @media (min-width: 1280px) { .container { max-width: 1280px; } }
          `}
        />
      </head>
      <body className={inter.className}>
        <HydrationErrorBoundary>
          <ThemeProvider>
            <NextUIProvider>
              <CustomCursor />
              <Navbar />
              {children}
              <Footer />
              <BackToTop />
              {/* Client-side only performance components */}
              <ClientPerformanceWrapper />
            </NextUIProvider>
          </ThemeProvider>
        </HydrationErrorBoundary>
      </body>
    </html>
  );
}