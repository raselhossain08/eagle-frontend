import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { TechnologyPreview } from "@/components/technology-preview"
import { PricingTiers } from "@/components/pricing-tiers"
import { MentorshipPackages } from "@/components/mentorship-packages"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Hero />
      <Features />
      <TechnologyPreview />
      <PricingTiers />
      <MentorshipPackages />
      <Footer />
    </div>
  )
}
