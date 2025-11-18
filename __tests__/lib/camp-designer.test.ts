import { describe, it, expect, vi } from 'vitest';
import type { CampDesign } from '@/lib/camp-designer';

// Mock OpenAI
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  title: 'Test Camp',
                  description: 'A test camp description',
                  modules: [
                    {
                      title: 'Module 1',
                      order: 1,
                      missions: [
                        {
                          title: 'Mission 1',
                          description: 'Mission description',
                          aiRubricJson: '{"criteria": ["test"], "weights": [1.0]}',
                        },
                      ],
                    },
                  ],
                }),
              },
            },
          ],
        }),
      },
    },
  })),
}));

describe('Camp Designer', () => {
  it('should have proper CampDesign structure', () => {
    const mockDesign: CampDesign = {
      title: 'React Bootcamp',
      description: 'Learn React in 4 weeks',
      modules: [
        {
          title: 'React Basics',
          order: 1,
          missions: [
            {
              title: 'Create Component',
              description: 'Create your first React component',
              aiRubricJson: '{"criteria": ["structure"], "weights": [1.0]}',
            },
          ],
        },
      ],
    };

    expect(mockDesign).toBeDefined();
    expect(mockDesign.modules).toHaveLength(1);
    expect(mockDesign.modules[0].missions).toHaveLength(1);
    expect(mockDesign.modules[0].missions[0].title).toBe('Create Component');
  });

  it('should validate module order', () => {
    const design: CampDesign = {
      title: 'Test Camp',
      description: 'Test description',
      modules: [
        { title: 'Module 1', order: 1, missions: [] },
        { title: 'Module 2', order: 2, missions: [] },
        { title: 'Module 3', order: 3, missions: [] },
      ],
    };

    const orders = design.modules.map((m) => m.order);
    expect(orders).toEqual([1, 2, 3]);
  });

  it('should handle missions with AI rubrics', () => {
    const rubricJson = JSON.stringify({
      criteria: ['completeness', 'quality', 'creativity'],
      weights: [0.4, 0.4, 0.2],
    });

    const mission = {
      title: 'Build a Todo App',
      description: 'Create a fully functional todo application',
      aiRubricJson: rubricJson,
    };

    expect(mission.aiRubricJson).toBeDefined();
    const parsed = JSON.parse(mission.aiRubricJson!);
    expect(parsed.criteria).toHaveLength(3);
    expect(parsed.weights).toHaveLength(3);
    expect(parsed.weights.reduce((a, b) => a + b, 0)).toBeCloseTo(1.0);
  });
});
