import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc';

export const missionRouter = router({
  // ミッション詳細取得
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.mission.findUnique({
        where: { id: input.id },
        include: {
          module: {
            include: {
              camp: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          submissions: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }),

  // モジュール内のミッション一覧
  getByModule: publicProcedure
    .input(z.object({ moduleId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.mission.findMany({
        where: { moduleId: input.moduleId },
        orderBy: { createdAt: 'asc' },
        include: {
          _count: {
            select: { submissions: true },
          },
        },
      });
    }),

  // ミッション作成
  create: publicProcedure
    .input(
      z.object({
        moduleId: z.string(),
        title: z.string().min(1),
        description: z.string(),
        dueDate: z.date().optional(),
        aiRubricJson: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.mission.create({
        data: input,
      });
    }),

  // ミッション更新
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        aiRubricJson: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.mission.update({
        where: { id },
        data,
      });
    }),

  // ミッション削除
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.mission.delete({
        where: { id: input.id },
      });
    }),
});
