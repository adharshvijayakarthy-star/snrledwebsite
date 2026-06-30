import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SNRLED | Invite Only Pool Experience",
  description:
    "The city's most exclusive pool experience. Invite only. If you know, you know.",
  icons: {
    icon: "/branding/logo.jpg",
    apple: "/branding/logo.jpg",
  },
  openGraph: {
    title: "SNRLED | Invite Only",
    description: "The city's most exclusive pool experience.",
    type: "website",
    siteName: "SNRLED",
    images: ["/gallery/snrled-party-05.jpeg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SNRLED | Invite Only",
    description: "The city's most exclusive pool experience.",
    images: ["/gallery/snrled-party-05.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`} data-scroll-behavior="smooth">
      <body className="min-h-full font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              toast: "glass chrome-border text-highlight",
              success: "border-success/30",
              error: "border-danger/30",
            },
          }}
          richColors
        />
      </body>
    </html>
  );
}
