import { router } from '../trpc';
import { budgetRouter } from './budget';
import { MainCategoryRouter } from './mainCategory';
import { paymentMethodRouter } from './paymentMethod';
import { transactionRouter } from './transaction';

/**
 * メインのtRPCルーター
 * 全てのAPIルーターを統合する
 */
export const appRouter = router({
  // 取引関連のAPIルーター
  transactions: transactionRouter,
  mainCategories: MainCategoryRouter,
  budgets: budgetRouter,
  paymentMethods: paymentMethodRouter,
});

/**
 * AppRouter型の定義
 * フロントエンドのtRPCクライアントで使用される型
 */
export type AppRouter = typeof appRouter;
