import { afterEach, expect, it, vi } from 'vitest';
import {
  NAVER_ANALYTICS_ID,
  flushNaverConversions,
  resetNaverAnalyticsState,
  trackNaverConversion,
  trackNaverPageView,
} from './naver';

afterEach(() => {
  resetNaverAnalyticsState();
  delete window.wcs;
  delete window.wcs_add;
  delete window.wcs_do;
});

it('sends a lead conversion with only the conversion type', () => {
  const trans = vi.fn();
  window.wcs = { trans };
  trackNaverConversion('lead');
  expect(trans).toHaveBeenCalledWith({ type: 'lead' });
  expect(window.wcs_add?.['wa']).toBe(NAVER_ANALYTICS_ID);
});

it('queues conversions until wcslog.js loads, then flushes them once', () => {
  trackNaverConversion('custom001');
  const trans = vi.fn();
  window.wcs = { trans };
  flushNaverConversions();
  flushNaverConversions();
  expect(trans).toHaveBeenCalledTimes(1);
  expect(trans).toHaveBeenCalledWith({ type: 'custom001' });
});

it('sends one page view per page key', () => {
  const inflow = vi.fn();
  const wcsDo = vi.fn();
  window.wcs = { inflow };
  window.wcs_do = wcsDo;
  trackNaverPageView('/menu');
  trackNaverPageView('/menu');
  trackNaverPageView('/inquiry');
  expect(inflow).toHaveBeenCalledTimes(2);
  expect(wcsDo).toHaveBeenCalledTimes(2);
});

it('does nothing before the script loads', () => {
  expect(() => trackNaverPageView('/')).not.toThrow();
});
