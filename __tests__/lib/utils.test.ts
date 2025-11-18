import { describe, it, expect } from 'vitest';
import { isCampActive, getCampDuration, truncate, cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('isCampActive', () => {
    it('should return true for active camp', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      expect(isCampActive(yesterday, tomorrow)).toBe(true);
    });

    it('should return false for past camp', () => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      expect(isCampActive(twoWeeksAgo, oneWeekAgo)).toBe(false);
    });

    it('should return false for future camp', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      expect(isCampActive(tomorrow, nextWeek)).toBe(false);
    });
  });

  describe('getCampDuration', () => {
    it('should calculate duration correctly', () => {
      const start = new Date('2024-11-01');
      const end = new Date('2024-11-30');

      expect(getCampDuration(start, end)).toBe(29);
    });

    it('should handle same day', () => {
      const date = new Date('2024-11-01');

      expect(getCampDuration(date, date)).toBe(0);
    });

    it('should work with string dates', () => {
      expect(getCampDuration('2024-11-01', '2024-11-08')).toBe(7);
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncate(longText, 20)).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const shortText = 'Short text';
      expect(truncate(shortText, 20)).toBe('Short text');
    });

    it('should handle exact length', () => {
      const text = 'Exactly twenty chars';
      expect(truncate(text, 20)).toBe('Exactly twenty chars');
    });
  });

  describe('cn (className utility)', () => {
    it('should combine multiple classes', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', false, null, undefined, 'class2')).toBe('class1 class2');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;

      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
    });
  });
});
