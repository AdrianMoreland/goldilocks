"use client"

import React from 'react'
import { LandingNavbar } from './components/navbar.tsx'
import { HeroSection } from './components/hero-section.tsx'
import { LogoCarousel } from './components/logo-carousel.tsx'
import { StatsSection } from './components/stats-section.tsx'
import { FeaturesSection } from './components/features-section.tsx'
import { TeamSection } from './components/team-section.tsx'
import { TestimonialsSection } from './components/testimonials-section.tsx'
import { BlogSection } from './components/blog-section.tsx'
import { PricingSection } from './components/pricing-section.tsx'
import { CTASection } from './components/cta-section.tsx'
import { ContactSection } from './components/contact-section.tsx'
import { FaqSection } from './components/faq-section.tsx'
import { LandingFooter } from './components/footer.tsx'
import { LandingThemeCustomizer, LandingThemeCustomizerTrigger } from './components/landing-theme-customizer.tsx'
import { AboutSection } from './components/about-section.tsx'

export default function LandingPage() {
  const [themeCustomizerOpen, setThemeCustomizerOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content */}
      <main>
        <HeroSection />
        <LogoCarousel />
        <StatsSection />
        <AboutSection />
        <FeaturesSection />
        <TeamSection />
        <PricingSection />
        <TestimonialsSection />
        <BlogSection />
        <FaqSection />
        <CTASection />
        <ContactSection />
      </main>

      {/* Footer */}
      <LandingFooter />

      {/* Theme Customizer */}
      <LandingThemeCustomizerTrigger onClick={() => setThemeCustomizerOpen(true)} />
      <LandingThemeCustomizer
        open={themeCustomizerOpen}
        onOpenChange={setThemeCustomizerOpen}
      />
    </div>
  )
}
