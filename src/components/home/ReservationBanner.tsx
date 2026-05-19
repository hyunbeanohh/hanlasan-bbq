import TrustChips from './reservation/TrustChips';
import QuickQuoteForm from './reservation/QuickQuoteForm';
import ContactChannels from './reservation/ContactChannels';

export default function ReservationBanner() {
  const siteKey = process.env.TURNSTILE_SITE_KEY ?? '';

  return (
    <section id="contact" className="py-20 md:py-24 bg-brand">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <TrustChips />

        <h2 className="text-3xl md:text-4xl font-bold text-white text-left md:text-center leading-tight mb-3">
          1분이면 견적 도착
        </h2>
        <p className="text-white/85 text-base md:text-lg text-left md:text-center max-w-xl md:mx-auto mb-8 md:mb-10 leading-relaxed">
          인원·날짜·장소만 알려주시면 맞춤 메뉴와 가격을 빠르게 보내드려요.
          <span className="hidden md:inline"> 상담은 무료, 견적 후 부담 없이 결정하세요.</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 lg:gap-5 items-start">
          <QuickQuoteForm siteKey={siteKey} />
          <ContactChannels />
        </div>
      </div>
    </section>
  );
}
