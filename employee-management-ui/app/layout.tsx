import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Import your new components (the @ symbol automatically finds them!)
import Sidebar from "../components/sidebar";
import Header from "../components/header";
import Footer from "../components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "Next.js frontend",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en">
      <body className={`${inter.className} flex h-screen bg-gray-50 overflow-hidden`}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 text-black">
          {children}
        </main>
        <Footer />
      </div>
      </body>
      </html>
  );
}