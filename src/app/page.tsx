import Navbar from "@/components/layout/navbar";
import Hero from "@/components/home/hero";
import TrustStrip from "@/components/home/trust-strip";
import Services from "@/components/home/services";
import HowItWorks from "@/components/home/how-it-works";
import TrackingCta from "@/components/home/tracking-cta";
import WhyVanguard from "@/components/home/why-vanguard";
import Coverage from "@/components/home/coverage";
import FinalCta from "@/components/home/final-cta";
import Footer from "@/components/home/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <Navbar />
      <Hero />
      <TrustStrip />
      <Services />
      <HowItWorks />
      <TrackingCta />
      <WhyVanguard />
      <Coverage />
      <FinalCta />
      <Footer />
    </main>
  );
}