import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://aifreshdaily.com"),
  title: {
    default: "AI Fresh Daily — Latest AI News & Insights",
    template: "%s | AI Fresh Daily",
  },
  description:
    "Your daily dose of AI news. Original articles on models, agents, regulation, and industry trends — written by AI, verified by editors.",
  keywords: ["AI news", "artificial intelligence", "machine learning", "LLM", "GPT", "DeepSeek", "AI models"],
  authors: [{ name: "AI Fresh Daily" }],
  creator: "AI Fresh Daily",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aifreshdaily.com",
    siteName: "AI Fresh Daily",
    title: "AI Fresh Daily — Latest AI News & Insights",
    description: "Original AI news articles updated every 4 hours.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Fresh Daily" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fresh Daily",
    description: "Original AI news articles updated every 4 hours.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
