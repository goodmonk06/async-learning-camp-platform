import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc';
import { designCamp } from '@/lib/camp-designer';

export const designerRouter = router({
  // AIでキャンプ設計を生成
  generateDesign: publicProcedure
    .input(
      z.object({
        goal: z.string().min(1),
        duration: z.string().min(1),
        targetAudience: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      return await designCamp(input.goal, input.duration, input.targetAudience);
    }),

  // 生成されたデザインからキャンプとモジュール、ミッションを一括作成
  createFromDesign: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        modules: z.array(
          z.object({
            title: z.string().min(1),
            order: z.number(),
            missions: z.array(
              z.object({
                title: z.string().min(1),
                description: z.string(),
                aiRubricJson: z.string().optional(),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { modules, ...campData } = input;

      // トランザクションでキャンプ、モジュール、ミッションを一括作成
      const camp = await ctx.prisma.camp.create({
        data: {
          ...campData,
          modules: {
            create: modules.map((module) => ({
              title: module.title,
              order: module.order,
              missions: {
                create: module.missions.map((mission) => ({
                  title: mission.title,
                  description: mission.description,
                  aiRubricJson: mission.aiRubricJson,
                })),
              },
            })),
          },
        },
        include: {
          modules: {
            include: {
              missions: true,
            },
          },
        },
      });

      return camp;
    }),
});
