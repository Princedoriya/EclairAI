import BgGradient from "@/components/common/bg-gradient";
import CTASection from "@/components/home/cta-section";
import DemoSection from "@/components/home/demo-section";
import HeroSection from "@/components/home/hero-section";
import HowItWorksSection from "@/components/home/how-it-works";
import PricingSection from "@/components/home/pricing-section";
import { hasReachedUploadLimit } from "@/lib/user";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  let hasReachedLimit = false;

  if (user && user.emailAddresses.length > 0) {
    const email = user.emailAddresses[0].emailAddress;
    const result = await hasReachedUploadLimit(email);
    hasReachedLimit = result.hasReachedLimit;
  }

  return (
    <div className="relative w-full">
      <BgGradient />
      <div className="flex flex-col">
        <HeroSection hasReachedLimit={hasReachedLimit} />
        <DemoSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection hasReachedLimit={hasReachedLimit} />
      </div>
    </div>
  );
}
