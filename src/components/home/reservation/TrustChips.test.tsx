import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import TrustChips from './TrustChips';

describe('TrustChips', () => {
  it('renders all three chips with correct copy', () => {
    render(<TrustChips />);
    expect(screen.getByText(/평일 10분 내 회신/)).toBeInTheDocument();
    expect(screen.getByText(/10년/)).toBeInTheDocument();
    expect(screen.getByText(/전국 출장/)).toBeInTheDocument();
  });

  it('does not render legacy 제주 copy', () => {
    render(<TrustChips />);
    expect(screen.queryByText(/제주/)).not.toBeInTheDocument();
  });

  it('marks the list with the trust label', () => {
    render(<TrustChips />);
    expect(screen.getByRole('list', { name: '신뢰 정보' })).toBeInTheDocument();
  });

  it('shows all three chips without responsive hiding classes', () => {
    const { container } = render(<TrustChips />);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(3);
    items.forEach((li) => {
      expect(li.className).not.toMatch(/hidden/);
    });
  });
});
