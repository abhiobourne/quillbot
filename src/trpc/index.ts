import { initTRPC } from '@trpc/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { db } from "@/db";
import { privateProcedure } from './trpc';
import { z } from "zod";
import { UploadStatus } from '@prisma/client';

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;


export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = getUser();

    if (!user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // Check if the user is in the database
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      // Create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ctx}) => {
    const {userId} = ctx
    return await db.file.findMany({
      where: {
        userId
      }
    })
  }),

  getFileUploadStatus: privateProcedure
  .input(z.object({ fileId: z.string() }))
  .query(async ({ input, ctx }) => {
    const file = await db.file.findFirst({
      where: {
        id: input.fileId,
        userId: ctx.userId,
      },
    })

    if (!file) return { status: 'PENDING' as const }

    return { status: file.uploadStatus }
  }),


  getFile : privateProcedure
  .input(z.object({key: z.string()}))
  .mutation(async({ctx, input}) => {
    const {userId} = ctx

    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId
      },
    })
    if(!file) throw new TRPCError({code: 'NOT_FOUND'}) 
      return file
  }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx

      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId,
        },
      })

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' })

      await db.file.delete({
        where: {
          id: input.id,
        },
      })

      return file
    }),
})


export type AppRouter = typeof appRouter;
