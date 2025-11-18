import { router } from '@/lib/trpc';
import { campRouter } from './camp';
import { missionRouter } from './mission';
import { submissionRouter } from './submission';
import { enrollmentRouter } from './enrollment';
import { designerRouter } from './designer';

export const appRouter = router({
  camp: campRouter,
  mission: missionRouter,
  submission: submissionRouter,
  enrollment: enrollmentRouter,
  designer: designerRouter,
});

export type AppRouter = typeof appRouter;
