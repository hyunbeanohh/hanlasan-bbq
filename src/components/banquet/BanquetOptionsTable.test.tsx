import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BanquetOptionsTable from './BanquetOptionsTable';
import { BANQUET_OPTIONS } from '@/data/banquet-options';

describe('BanquetOptionsTable', () => {
  it('renders one row per option', () => {
    render(<BanquetOptionsTable />);
    const table = screen.getByRole('table');
    const bodyRows = within(table).getAllByRole('row').slice(1); // skip header row
    expect(bodyRows).toHaveLength(BANQUET_OPTIONS.length);
  });

  it('formats prices as locale-aware Korean won', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByText('160,000원')).toBeInTheDocument();
    expect(screen.getByText('120,000원')).toBeInTheDocument();
    expect(screen.getByText('1,300원')).toBeInTheDocument();
    expect(screen.getByText('13,000원')).toBeInTheDocument();
  });

  it('shows detail text for items that have a detail, and an em dash otherwise', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByText('테이블 보 포함')).toBeInTheDocument();
    expect(screen.getByText('20,000cc · 잔 포함')).toBeInTheDocument();
    // 김치/의자/천막은 detail이 null이라 em dash 노출
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(3);
  });

  it('has an accessible caption', () => {
    render(<BanquetOptionsTable />);
    expect(screen.getByRole('table', { name: '단체 옵션 및 부대 가격표' })).toBeInTheDocument();
  });
});
