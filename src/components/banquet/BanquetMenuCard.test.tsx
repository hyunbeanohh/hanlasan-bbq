import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BanquetMenuCard from './BanquetMenuCard';
import type { BanquetMenuItem } from '@/types';

const withImage: BanquetMenuItem = {
  id: 'japchae',
  name: '잡채',
  portion: '8인분 (1Kg)',
  price: '25,000원',
  imageSrc: '/images/banquet/japchae.jpg',
};

const withoutImage: BanquetMenuItem = {
  id: 'kimchi-jjigae',
  name: '김치찌개',
  portion: '1인분',
  price: '5,000원',
};

describe('BanquetMenuCard', () => {
  it('renders the photo when imageSrc is provided', () => {
    render(<BanquetMenuCard item={withImage} />);
    const img = screen.getByAltText('잡채');
    expect(img).toBeInTheDocument();
  });

  it('renders fallback placeholder when imageSrc is missing', () => {
    render(<BanquetMenuCard item={withoutImage} />);
    expect(screen.getByText('사진 준비중')).toBeInTheDocument();
    expect(screen.queryByAltText('김치찌개')).not.toBeInTheDocument();
  });
});
