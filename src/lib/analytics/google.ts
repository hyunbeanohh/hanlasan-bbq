type ConversionEvent = 'phone_click' | 'generate_lead';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Only fixed event fields are accepted; never forward form values or URLs.
export function trackGoogleConversion(event: ConversionEvent) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  try {
    window.dataLayer = window.dataLayer || [];
    function enqueue(...args: unknown[]) {
      void args;
      // gtag commands use an Arguments object in the shared dataLayer queue.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    enqueue('event', event, {
      send_to: 'G-F208LM9Z8K',
      ...(event === 'generate_lead' ? { form_name: 'quick_quote' } : {}),
    });
  } catch {
    // Analytics must never interrupt navigation or a successful submission.
  }
}
