import { describe, it, expect } from 'vitest';
import { QUICK_QUOTE_AUTHOR, QUICK_QUOTE_DISPLAY_AUTHOR } from '../constants';

describe('quick-quote constants', () => {
  it('QUICK_QUOTE_AUTHOR matches the DB marker value', () => {
    expect(QUICK_QUOTE_AUTHOR).toBe('[빠른 견적]');
  });

  it('QUICK_QUOTE_DISPLAY_AUTHOR is the bracket-free display label', () => {
    expect(QUICK_QUOTE_DISPLAY_AUTHOR).toBe('빠른 견적');
  });
});
