// app/layout.tsx
import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
    title: "PeopleOS — Employee Management",
    description: "Modern employee management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${dmSans.variable} ${geistMono.variable}`}>
        <body className="bg-[#F4F5F7] text-[#1A1D23] antialiased">
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
                <footer className="border-t border-[#E8EAED] bg-white px-8 py-3 text-xs text-[#8B909A] flex justify-between items-center">
                    <span>PeopleOS v2.4.1</span>
                    <span>© {new Date().getFullYear()} All rights reserved</span>
                </footer>
            </div>
        </div>
        </body>
        </html>
    );
}