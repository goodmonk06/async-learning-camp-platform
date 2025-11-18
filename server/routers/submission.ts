import { z } from 'zod';
import { router, publicProcedure } from '@/lib/trpc';
import { generateAIFeedback } from '@/lib/ai-feedback';

export const submissionRouter = router({
  // 提出物一覧（ミッション別）
  getByMission: publicProcedure
    .input(z.object({ missionId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.submission.findMany({
        where: { missionId: input.missionId },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // 提出物一覧（ユーザー別）
  getByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.submission.findMany({
        where: { userId: input.userId },
        include: {
          mission: {
            include: {
              module: {
                include: {
                  camp: {
                    select: { id: true, title: true },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),

  // レビュー待ちの提出物一覧
  getPendingReview: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.submission.findMany({
      where: { status: 'submitted' },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        mission: {
          include: {
            module: {
              include: {
                camp: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }),

  // 提出物詳細取得
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.submission.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
          mission: {
            include: {
              module: {
                include: {
                  camp: true,
                },
              },
            },
          },
        },
      });
    }),

  // 提出物作成（AIフィードバック付き）
  create: publicProcedure
    .input(
      z.object({
        missionId: z.string(),
        userId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // ミッション情報を取得
      const mission = await ctx.prisma.mission.findUnique({
        where: { id: input.missionId },
      });

      if (!mission) {
        throw new Error('Mission not found');
      }

      // 提出物を作成
      const submission = await ctx.prisma.submission.create({
        data: {
          ...input,
          status: 'submitted',
        },
      });

      // AIフィードバックを非同期で生成
      try {
        const feedback = await generateAIFeedback(
          mission.title,
          mission.description,
          input.content,
          mission.aiRubricJson
        );

        // フィードバックを更新
        await ctx.prisma.submission.update({
          where: { id: submission.id },
          data: { feedbackMarkdown: feedback },
        });
      } catch (error) {
        console.error('AI feedback generation failed:', error);
      }

      return submission;
    }),

  // 提出物更新（メンターによる手動レビュー）
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(['submitted', 'reviewed', 'revised']).optional(),
        score: z.number().min(0).max(100).optional(),
        feedbackMarkdown: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.submission.update({
        where: { id },
        data,
      });
    }),

  // 提出物削除
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.submission.delete({
        where: { id: input.id },
      });
    }),
});
