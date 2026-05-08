import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "@/styles/globals.css";

import ClientProviders from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Earthworm",
  description: "Earthworm - Learn English through practice",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
