import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'LungAI — AI-Powered Chest X-Ray Disease Detection',
  description:
    'Research prototype for multi-disease detection and 3D anatomical explainability on chest X-ray scans.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c14] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {/*
          ClientLayout handles:
          - Mobile sidebar drawer state (isMobileMenuOpen)
          - Framer Motion MotionConfig with reducedMotion="user" (prefers-reduced-motion support)
          - Header + Sidebar rendering
        */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
