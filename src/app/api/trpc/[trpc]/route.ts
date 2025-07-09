import { appRouter } from '@/server/routers';
import { createTRPCContext } from '@/server/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

/**
 * Next.js App Router用のtRPCハンドラー
 *
 * このファイルが全てのtRPC APIリクエストを処理する
 * URL: /api/trpc/* の全てのリクエスト
 */

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: 'api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
            );
          }
        : undefined,
  });
};

/**
 * Next.js App RouterのHTTPメソッド対応
 * tRPCは基本的にPOSTリクエストを使用するが、
 * GETリクエスト（クエリ）にも対応
 */
export { handler as GET, handler as POST };
