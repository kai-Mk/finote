import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';

/**
 * Context作成関数
 * fetch adapter用の型に対応
 */
export const createTRPCContext = async (opts: { req: Request }) => {
  return {
    prisma,
    headers: opts.req.headers,
  };
};

/**
 * Context型の定義
 */
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * tRPCの初期化（Context型付き）
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * tRPCルーターの作成
 */
export const router = t.router;

/**
 * Public Procedure（認証不要）
 * ctx.prismaが正しく型付けされる
 */
export const publicProcedure = t.procedure;
