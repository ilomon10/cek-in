import { CampaignBand } from "@/components/pages/welcome/campaign-band";
import { CTA } from "@/components/pages/welcome/cta";
import { FAQ } from "@/components/pages/welcome/faq";
import { Features } from "@/components/pages/welcome/features";
import { Footer } from "@/components/pages/welcome/footer";
import { Header } from "@/components/pages/welcome/header";
import { Hero } from "@/components/pages/welcome/hero";
import { HowItWorks } from "@/components/pages/welcome/how-it-works";
import { HowItWorksSection } from "@/components/pages/welcome/how-it-works-section";
import { LogoCloud } from "@/components/pages/welcome/logo-cloud";
import { Pricing } from "@/components/pages/welcome/pricing";
import { Testimonials } from "@/components/pages/welcome/testimonials";
import { TransparencySection } from "@/components/pages/welcome/transparency";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LogoCloud />
      <Features />
      <CampaignBand />
      {/* <HowItWorks /> */}
      <HowItWorksSection />
      <TransparencySection />
      {/* <Pricing /> */}
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
