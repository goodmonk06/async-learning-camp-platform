import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc';

export const campRouter = router({
  // キャンプ一覧取得
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.camp.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
    });
  }),

  // 開催中のキャンプ取得
  getActive: publicProcedure.query(async ({ ctx }) => {
    const now = new Date();
    return ctx.prisma.camp.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
    });
  }),

  // キャンプ詳細取得
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.camp.findUnique({
        where: { id: input.id },
        include: {
          modules: {
            orderBy: { order: 'asc' },
            include: {
              missions: {
                select: {
                  id: true,
                  title: true,
                  dueDate: true,
                  _count: { select: { submissions: true } },
                },
              },
            },
          },
          enrollments: {
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true },
              },
            },
          },
        },
      });
    }),

  // キャンプ作成
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.camp.create({
        data: input,
      });
    }),

  // キャンプ更新
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        visibility: z.enum(['public', 'private', 'unlisted']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.camp.update({
        where: { id },
        data,
      });
    }),

  // キャンプ削除
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.camp.delete({
        where: { id: input.id },
      });
    }),
});
