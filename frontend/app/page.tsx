import React from 'react';
import Hero from '@/components/landing/Hero';
import ProblemSection from '@/components/landing/ProblemSection';
import HowItWorks from '@/components/landing/HowItWorks';
import AIAnalysis from '@/components/landing/AIAnalysis';
import DiseaseDetection from '@/components/landing/DiseaseDetection';
import HeatmapSection from '@/components/landing/HeatmapSection';
import DashboardPreview from '@/components/landing/DashboardPreview';
import ResearchSection from '@/components/landing/ResearchSection';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'LUNG AI — AI-Powered Chest X-Ray Disease Detection',
  description:
    'AI-assisted multi-disease classification and 3D anatomical explainability workstation for medical imaging decision-support research.',
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050A14] text-slate-100 font-body antialiased">
      {/* Stage 1: Hero Section */}
      <Hero />

      {/* Stage 2: Problem + How It Works */}
      <ProblemSection />
      <HowItWorks />

      {/* Stage 3: AI Analysis + Multi-Disease Detection + Heatmap */}
      <AIAnalysis />
      <DiseaseDetection />
      <HeatmapSection />

      {/* Stage 4: Dashboard Preview + Research/Trust + Final CTA + Footer */}
      <DashboardPreview />
      <ResearchSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
