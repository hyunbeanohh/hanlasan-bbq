import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Testimonials from './Testimonials';
import { TESTIMONIALS } from '@/data/testimonials';

beforeAll(() => {
  // jsdom does not implement these browser APIs that embla uses during init.
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (!('IntersectionObserver' in window)) {
    class IO {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    (window as unknown as { IntersectionObserver: typeof IO }).IntersectionObserver = IO;
  }
  if (!('ResizeObserver' in window)) {
    class RO {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (window as unknown as { ResizeObserver: typeof RO }).ResizeObserver = RO;
  }
});

describe('Testimonials carousel', () => {
  it('renders all testimonials in the DOM', () => {
    render(<Testimonials />);
    TESTIMONIALS.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument();
      expect(screen.getByText(t.role)).toBeInTheDocument();
      expect(screen.getByText(`“${t.quote}”`)).toBeInTheDocument();
    });
  });

  it('exposes section as a carousel with proper aria label', () => {
    render(<Testimonials />);
    const section = screen.getByRole('region', { name: '고객 후기' });
    expect(section).toHaveAttribute('aria-roledescription', 'carousel');
  });

  it('renders one blog link per testimonial with safe target/rel', () => {
    render(<Testimonials />);
    const links = screen
      .getAllByRole('link')
      .filter((a) => a.textContent?.includes('네이버 블로그 원문'));
    expect(links).toHaveLength(TESTIMONIALS.length);
    links.forEach((link, i) => {
      expect(link).toHaveAttribute('href', TESTIMONIALS[i].blogUrl);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders prev/next arrow buttons', () => {
    render(<Testimonials />);
    expect(
      screen.getByRole('button', { name: '이전 후기' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '다음 후기' }),
    ).toBeInTheDocument();
  });

  it('renders one dot button per slide', () => {
    render(<Testimonials />);
    const dots = screen.getAllByRole('button', { name: /번째 후기로 이동$/ });
    expect(dots).toHaveLength(TESTIMONIALS.length);
  });
});
