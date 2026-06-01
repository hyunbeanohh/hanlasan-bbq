import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

const trackMock = vi.fn();
vi.mock('@/lib/analytics/naver', () => ({
  trackNaverEvent: (e: unknown) => trackMock(e),
}));
vi.mock('@/lib/analytics/utm', () => ({
  getUtm: () => ({ utm_source: 'test' }),
}));

import HeroPhoneChip from './HeroPhoneChip';
import { CONTACT } from '@/lib/constants';

describe('HeroPhoneChip', () => {
  beforeEach(() => {
    trackMock.mockReset();
  });

  it('renders a tel link with the contact phone number', () => {
    render(<HeroPhoneChip />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', CONTACT.phoneTel);
    expect(link.textContent).toContain(CONTACT.phone);
  });

  it('fires phone_click with source=hero_chip on click', () => {
    render(<HeroPhoneChip />);
    fireEvent.click(screen.getByRole('link'));
    expect(trackMock).toHaveBeenCalledWith(
      expect.objectContaining({ event: 'phone_click', source: 'hero_chip' }),
    );
  });
});
