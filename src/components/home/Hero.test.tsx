import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('@/lib/analytics/naver', () => ({ trackNaverEvent: () => {} }));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));
// QuickQuoteForm pulls in TurnstileWidget which fetches a remote script.
// Stub TurnstileWidget so JSDOM does not try to load network resources.
vi.mock('@/components/inquiry/TurnstileWidget', () => ({
  default: () => null,
}));

import Hero from './Hero';

describe('Hero', () => {
  it('renders H1 from HeroCopy', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(
      /전국 출장바베큐/,
    );
  });

  it('renders the QuickQuoteForm fields', () => {
    render(<Hero />);
    // QuickQuoteForm input labels: 인원 / 희망 날짜 / 출장 장소 / 연락처
    expect(screen.getByLabelText(/인원/)).toBeInTheDocument();
    expect(screen.getByLabelText(/출장 장소/)).toBeInTheDocument();
    expect(screen.getByLabelText(/연락처/)).toBeInTheDocument();
  });

  it('has the section landmark with the hero title', () => {
    render(<Hero />);
    const section = screen.getByRole('region', { name: /전국 출장바베큐/ });
    expect(section).toBeInTheDocument();
  });
});
