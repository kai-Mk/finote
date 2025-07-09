'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { trpc } from '@/lib/trpc';

/**
 * tRPCとReact Queryのプロバイダー
 * クライアントコンポーネントでのみtRPCを使用可能にする
 * サーバーコンポーネントでは直接trpcClientを使用
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // React Queryクライアントの作成
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // SSRでの初期データがある場合、即座に表示
            staleTime: 5 * 60 * 1000, // 5分間キャッシュ
            // ネットワークエラー時の再試行
            retry: (failureCount, error: any) => {
              // 4xx系エラーは再試行しない
              if (
                error?.data?.httpStatus >= 400 &&
                error?.data?.httpStatus < 500
              ) {
                return false;
              }
              // 最大3回まで再試行
              return failureCount < 3;
            },
            // バックグラウンドでの再取得を制御
            refetchOnWindowFocus: false,
          },
          mutations: {
            // mutation失敗時の再試行設定
            retry: 1,
          },
        },
      })
  );

  // tRPCクライアントの作成
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: getBaseUrl() + '/api/trpc',
          transformer: superjson,

          // リクエストヘッダーの設定
          headers() {
            return {
              // CSRFトークンやその他のセキュリティヘッダー
              'x-client-source': 'web-app',
              // 将来的な認証ヘッダー
              // ...(typeof window !== 'undefined' && getAuthToken() && {
              //   authorization: `Bearer ${getAuthToken()}`
              // }),
            };
          },

          // fetch設定の拡張
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: 'include', // Cookieを含める
              // タイムアウト設定（AbortController使用）
              signal: AbortSignal.timeout(30000), // 30秒
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* 開発環境でのみReact Query Devtoolsを表示 */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

/**
 * ベースURLの取得（クライアントサイド用）
 * 環境に応じて適切なAPIエンドポイントを返す
 */
function getBaseUrl() {
  // ブラウザ環境では相対パス（同一オリジン）
  if (typeof window !== 'undefined') {
    return '';
  }

  // Vercel本番環境
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // カスタム本番URL（環境変数で設定）
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // ローカル開発環境
  return 'http://localhost:3000';
}
