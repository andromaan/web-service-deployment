import { describe, it, expect } from 'vitest';

describe('Basic Tests', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should check string equality', () => {
    expect('hello').toBe('hello');
  });

  it('should verify array contents', () => {
    const arr = [1, 2, 3];
    expect(arr).toContain(2);
    expect(arr).toHaveLength(3);
  });
});
