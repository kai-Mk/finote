import { createTRPCReact } from '@trpc/react-query';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import type { AppRouter } from '@/server/routers';

/**
 * React用のtRPCクライアント
 * フロントエンドのReactコンポーネントで使用
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * Vanilla JavaScript用のtRPCクライアント
 * React外（サーバーサイド、utility関数等）で使用
 */
export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl() + '/api/trpc',
      transformer: superjson, // transformerをhttpBatchLink内に移動
      headers() {
        return {
          // 将来的な認証ヘッダー
          // authorization: getAuthToken(),
        };
      },
    }),
  ],
});

/**
 * ベースURLの取得
 * 環境に応じて適切なURLを返す
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // クライアントサイド: 現在のオリジンを使用
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Vercel本番環境
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    // カスタム本番URL
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // ローカル開発環境
  return 'http://localhost:3000';
}
