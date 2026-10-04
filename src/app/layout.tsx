import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Outfit } from "next/font/google";
import "./globals.css";
import { wedding } from "@/lib/config";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf7f1",
};

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: `${wedding.bride} & ${wedding.groom} — ${wedding.dateLabel}`,
  description: `You are invited to the wedding of ${wedding.bride} and ${wedding.groom} on ${wedding.dateLabel} in ${wedding.city}, ${wedding.state}.`,
  openGraph: {
    title: `${wedding.bride} & ${wedding.groom}`,
    description: `Wedding invitation · ${wedding.dateLabel} · ${wedding.city}`,
    images: ["/photos/web/couple-1.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
