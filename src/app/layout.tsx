import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import HeaderNavigation from "@/components/layout/Header/HeaderNavigation";

import header from "../components/layout/Header/Header.module.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Etiquetas",
  description: "Permite descargar etiquetas personalizadas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <Header />
              <div className={header.containerBarNav}>
        <HeaderNavigation role={1} />
      </div>
        <main>{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
//IO