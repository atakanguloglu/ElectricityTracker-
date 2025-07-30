import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'antd/dist/reset.css';
import { ConfigProvider, App } from 'antd';
import tr_TR from 'antd/locale/tr_TR';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elektrik Tüketim Takip Sistemi",
  description: "Modern elektrik tüketim takip dashboard sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider locale={tr_TR}>
          <App>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              {children}
            </div>
          </App>
        </ConfigProvider>
      </body>
    </html>
  );
}
