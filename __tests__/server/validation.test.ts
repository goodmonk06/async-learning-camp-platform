import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Data Validation', () => {
  describe('Camp validation', () => {
    const campSchema = z.object({
      title: z.string().min(1),
      description: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
    });

    it('should validate valid camp data', () => {
      const validCamp = {
        title: 'React Bootcamp',
        description: 'Learn React in 4 weeks',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        visibility: 'public' as const,
      };

      const result = campSchema.safeParse(validCamp);
      expect(result.success).toBe(true);
    });

    it('should reject camp with empty title', () => {
      const invalidCamp = {
        title: '',
        description: 'Learn React',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        visibility: 'public' as const,
      };

      const result = campSchema.safeParse(invalidCamp);
      expect(result.success).toBe(false);
    });

    it('should reject invalid visibility', () => {
      const invalidCamp = {
        title: 'React Bootcamp',
        description: 'Learn React',
        startDate: new Date('2024-11-01'),
        endDate: new Date('2024-11-30'),
        visibility: 'invalid',
      };

      const result = campSchema.safeParse(invalidCamp);
      expect(result.success).toBe(false);
    });
  });

  describe('Mission validation', () => {
    const missionSchema = z.object({
      moduleId: z.string(),
      title: z.string().min(1),
      description: z.string(),
      dueDate: z.date().optional(),
      aiRubricJson: z.string().optional(),
    });

    it('should validate valid mission data', () => {
      const validMission = {
        moduleId: 'module-123',
        title: 'Create a Component',
        description: 'Build your first React component',
        dueDate: new Date('2024-11-07'),
      };

      const result = missionSchema.safeParse(validMission);
      expect(result.success).toBe(true);
    });

    it('should allow optional fields', () => {
      const minimalMission = {
        moduleId: 'module-123',
        title: 'Create a Component',
        description: 'Build your first React component',
      };

      const result = missionSchema.safeParse(minimalMission);
      expect(result.success).toBe(true);
    });
  });

  describe('Submission validation', () => {
    const submissionSchema = z.object({
      missionId: z.string(),
      userId: z.string(),
      content: z.string().min(1),
    });

    it('should validate valid submission', () => {
      const validSubmission = {
        missionId: 'mission-123',
        userId: 'user-456',
        content: 'Here is my solution...',
      };

      const result = submissionSchema.safeParse(validSubmission);
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidSubmission = {
        missionId: 'mission-123',
        userId: 'user-456',
        content: '',
      };

      const result = submissionSchema.safeParse(invalidSubmission);
      expect(result.success).toBe(false);
    });
  });

  describe('Enrollment validation', () => {
    const enrollmentSchema = z.object({
      userId: z.string(),
      campId: z.string(),
      role: z.enum(['mentor', 'learner']).default('learner'),
    });

    it('should validate mentor role', () => {
      const enrollment = {
        userId: 'user-123',
        campId: 'camp-456',
        role: 'mentor' as const,
      };

      const result = enrollmentSchema.safeParse(enrollment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('mentor');
      }
    });

    it('should validate learner role', () => {
      const enrollment = {
        userId: 'user-123',
        campId: 'camp-456',
        role: 'learner' as const,
      };

      const result = enrollmentSchema.safeParse(enrollment);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe('learner');
      }
    });

    it('should reject invalid role', () => {
      const enrollment = {
        userId: 'user-123',
        campId: 'camp-456',
        role: 'admin',
      };

      const result = enrollmentSchema.safeParse(enrollment);
      expect(result.success).toBe(false);
    });
  });
});
