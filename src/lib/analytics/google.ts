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

type QuoteEvent = 'quote_submit' | 'quote_submit_error';
export type QuoteErrorReason = 'field' | 'verify' | 'limit' | 'server';

/** 견적 폼 이탈 측정용. 입력값은 보내지 않고 고정된 이유 코드만 보낸다. */
export function trackQuoteEvent(event: QuoteEvent, reason?: QuoteErrorReason, fields?: string) {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  try {
    window.dataLayer = window.dataLayer || [];
    function enqueue(...args: unknown[]) {
      void args;
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    }
    enqueue('event', event, {
      send_to: 'G-F208LM9Z8K',
      form_name: 'quick_quote',
      ...(reason ? { error_reason: reason } : {}),
      ...(fields ? { error_fields: fields.slice(0, 100) } : {}),
    });
  } catch {
    // Analytics must never interrupt the form.
  }
}
