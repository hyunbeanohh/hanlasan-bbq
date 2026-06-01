import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const trackMock = vi.fn();
vi.mock('@/lib/analytics/naver', () => ({
  trackNaverEvent: (e: unknown) => trackMock(e),
}));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));

import ReservationBanner from './ReservationBanner';
import { CONTACT } from '@/lib/constants';

describe('ReservationBanner (simplified)', () => {
  beforeEach(() => trackMock.mockReset());

  it('renders the section with id="contact" for anchor links', () => {
    const { container } = render(<ReservationBanner />);
    expect(container.querySelector('section#contact')).toBeInTheDocument();
  });

  it('renders the bottom phone CTA with the contact number', () => {
    render(<ReservationBanner />);
    const link = screen.getByRole('link', { name: new RegExp(CONTACT.phone) });
    expect(link).toHaveAttribute('href', CONTACT.phoneTel);
  });

  it('does NOT render any form input', () => {
    render(<ReservationBanner />);
    expect(screen.queryByLabelText(/인원/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/연락처/)).not.toBeInTheDocument();
  });

  it('fires phone_click with source=bottom_cta', () => {
    render(<ReservationBanner />);
    fireEvent.click(screen.getByRole('link', { name: new RegExp(CONTACT.phone) }));
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'phone_click', source: 'bottom_cta' }),
    );
  });
});
