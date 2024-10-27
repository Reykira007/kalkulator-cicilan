import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Kalkulator Cicilan - Simulasi Kredit Online",
    description: "Hitung cicilan kredit dengan mudah untuk motor, mobil, dan KPR",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="light">
            <body className={`${inter.className} min-h-screen bg-gray-50`}>
                {children}
            </body>
        </html>
    );
}