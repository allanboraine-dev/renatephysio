import { HeroSection } from '@/components/HeroSection';
import { TrustSignals } from '@/components/TrustSignals';
import { LocationContact } from '@/components/LocationContact';
import { BookingFlow } from '@/components/BookingFlow';
import { SymptomChecker } from '@/components/SymptomChecker';

export const metadata = {
  title: 'Renate Liebenberg Physiotherapists | Kimberley',
  description: 'High-performance, lead-generating patient portal and website for a local medical practice: Renate Liebenberg Physiotherapists, located at 205 Du Toitspan Road, Kimberley.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative">
      {/* Sticky Booking CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 md:hidden flex justify-center">
        <a href="#booking" className="w-full max-w-sm bg-blue-900 text-white text-center py-3 rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-lg">
          Book Appointment
        </a>
      </div>

      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        <TrustSignals />
        
        <div id="booking" className="scroll-mt-24 grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3">
            <BookingFlow />
          </div>
          <div className="lg:col-span-2 sticky top-24">
            <SymptomChecker />
          </div>
        </div>

        <LocationContact />
      </div>
    </main>
  );
}
