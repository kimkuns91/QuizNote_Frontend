import CTASection from '@/components/home/CTASection';
import FaqSection from '@/components/home/FaqSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import HeroSection from '@/components/home/HeroSection';
import HowToUseSection from '@/components/home/HowToUseSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <HowToUseSection />
      <FaqSection />
      <CTASection />
    </div>
  );
}