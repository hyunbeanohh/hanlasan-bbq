import { afterEach, expect, it, vi } from 'vitest';
import { trackGoogleConversion } from './google';

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.dataLayer;
});

it('queues only fixed conversion fields before the Google script loads', () => {
  vi.stubEnv('NODE_ENV', 'production');
  trackGoogleConversion('generate_lead');
  expect(Array.from(window.dataLayer![0] as ArrayLike<unknown>)).toEqual([
    'event', 'generate_lead', { send_to: 'G-F208LM9Z8K', form_name: 'quick_quote' },
  ]);
});

it('preserves the queue and excludes the phone number from click events', () => {
  vi.stubEnv('NODE_ENV', 'production');
  window.dataLayer = ['existing'];
  trackGoogleConversion('phone_click');
  expect(window.dataLayer[0]).toBe('existing');
  expect(Array.from(window.dataLayer[1] as ArrayLike<unknown>)).toEqual([
    'event', 'phone_click', { send_to: 'G-F208LM9Z8K' },
  ]);
});

it('does not collect development visits', () => {
  vi.stubEnv('NODE_ENV', 'development');
  trackGoogleConversion('phone_click');
  expect(window.dataLayer).toBeUndefined();
});
