import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

vi.mock('@/lib/analytics/naver', () => ({ trackNaverEvent: () => {} }));
vi.mock('@/lib/analytics/utm', () => ({ getUtm: () => ({}) }));

import HeroCopy from './HeroCopy';
import { CONTACT } from '@/lib/constants';

describe('HeroCopy', () => {
  it('renders the H1 brand line', () => {
    render(<HeroCopy />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toMatch(/참나무 훈연, 깔끔한 맛/);
    expect(h1.textContent).toMatch(/전국 출장바베큐/);
  });

  it('renders the action-oriented subcopy', () => {
    render(<HeroCopy />);
    expect(
      screen.getByText(/1분 안에 견적이 도착합니다/),
    ).toBeInTheDocument();
  });

  it('renders TrustChips with all three items', () => {
    render(<HeroCopy />);
    const list = screen.getByRole('list', { name: '신뢰 정보' });
    expect(list).toBeInTheDocument();
    expect(within(list).getByText(/전국 출장/)).toBeInTheDocument();
  });

  it('renders a tel link to the contact phone', () => {
    render(<HeroCopy />);
    const links = screen.getAllByRole('link');
    expect(
      links.some((l) => l.getAttribute('href') === CONTACT.phoneTel),
    ).toBe(true);
  });
});
