import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "../context/AppContext.jsx";
import { Toaster } from "@/components/ui/sonner";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "tastebuds",
  description: "Find the best taste for your buds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AppProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </AppProvider>
    </html>
  );
}
