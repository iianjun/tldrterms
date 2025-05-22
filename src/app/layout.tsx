import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import QueryProvider from "@/providers/QueryProvider";
import { Metadata } from "next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const title = "TL;DR Terms - Understand Terms of Service Easily";
  const description =
    "TLDRTerms is an AI-powered tool that instantly summarizes website Terms of Service into clear, human-readable sections. Built with Next.js and OpenAI, it helps users understand what they’re agreeing to—without reading pages of legal jargon.";

  return {
    metadataBase: new URL("https://tldrterms.app"),
    title: {
      default: title,
      template: "%s - TL;DR Terms",
    },
    description,
    keywords: [
      "terms of service summary",
      "privacy policy analyzer",
      "TL;DR Terms",
      "terms summarizer",
      "AI legal summary",
    ],
    openGraph: {
      title: {
        default: title,
        template: "%s - TL;DR Terms",
      },
      description,
      url: "https://tldrterms.app",
      siteName: "TL;DR Terms",
      images: [
        {
          url: "https://ormhjvtyrakenkccqrni.supabase.co/storage/v1/object/public/tldrterms/logo-image.png",
          width: 1200,
          height: 628,
          alt: "TL;DR Terms - Summarize Website Terms Easily",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: {
        default: title,
        template: "%s - TL;DR Terms",
      },
      description,
      images: [
        {
          url: "https://ormhjvtyrakenkccqrni.supabase.co/storage/v1/object/public/tldrterms/logo-image.png",
          width: 1200,
          height: 628,
        },
      ],
    },
    alternates: {
      canonical: "https://tldrterms.app",
    },
    icons: {
      icon: "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "antialiased")}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
