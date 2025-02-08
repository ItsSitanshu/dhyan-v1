import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Dhyan.ai",
  description: "Your personalized AI Tutor",
  icons: {
    icon: "/logo.svg",
    apple: "/logo-apple.svg",
    shortcut: "/logo.svg", 
  }
};

export const viewport = {
  themeColor: "#B61717",  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
