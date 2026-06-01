import QuickQuoteForm from './reservation/QuickQuoteForm';
import HeroCopy from './HeroCopy';

export default function Hero() {
  const siteKey = process.env.TURNSTILE_SITE_KEY ?? '';

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden min-h-[100svh] flex items-center"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/55"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <HeroCopy />
          <div>
            <h2 className="sr-only">빠른 견적 요청</h2>
            <QuickQuoteForm siteKey={siteKey} />
          </div>
        </div>
      </div>
    </section>
  );
}
