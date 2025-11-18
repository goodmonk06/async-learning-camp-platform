import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc';

export const enrollmentRouter = router({
  // キャンプの参加者一覧
  getByCamp: publicProcedure
    .input(z.object({ campId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.enrollment.findMany({
        where: { campId: input.campId },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    }),

  // ユーザーの参加キャンプ一覧
  getByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.enrollment.findMany({
        where: { userId: input.userId },
        include: {
          camp: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // 参加登録
  enroll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        campId: z.string(),
        role: z.enum(['mentor', 'learner']).default('learner'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.enrollment.create({
        data: input,
      });
    }),

  // 役割変更
  updateRole: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        campId: z.string(),
        role: z.enum(['mentor', 'learner']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.enrollment.update({
        where: {
          userId_campId: {
            userId: input.userId,
            campId: input.campId,
          },
        },
        data: { role: input.role },
      });
    }),

  // 参加解除
  unenroll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        campId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.enrollment.delete({
        where: {
          userId_campId: {
            userId: input.userId,
            campId: input.campId,
          },
        },
      });
    }),
});
