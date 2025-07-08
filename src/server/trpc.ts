import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';

/**
 * tRPCの初期化
 * - SuperJSON: Date、BigInt等の型を正確にシリアライズ
 * - ErrorFormatter: Zodバリデーションエラーの整形
 */
const t = initTRPC.create({
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
 * 現在は全てのAPIが認証不要で使用可能
 * 将来的に認証機能を追加する場合は、protectedProcedureを作成
 */
export const publicProcedure = t.procedure;

/**
 * Context作成関数
 * 各APIリクエストで共有される情報を定義
 * - prisma: データベースクライアント
 * - 将来的にuser情報等を追加予定
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    prisma,
    headers: opts.headers,
  };
};

/**
 * Context型の定義
 * tRPCルーター内で使用される型
 */
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
