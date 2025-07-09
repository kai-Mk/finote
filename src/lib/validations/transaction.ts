import { z } from 'zod';

/**
 * 取引の基本バリデーションスキーマ
 */
export const baseTransactionSchema = z.object({
  amount: z.number().positive('金額は0より大きい数値である必要があります'),
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: '収入または支出を選択してください' }),
  }),
  mainCategoryId: z.number().positive('親カテゴリーを選択してください'),
  subCategoryId: z.number().positive().optional(),
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),
  date: z.date({
    errorMap: () => ({ message: '有効な日付を入力してください' }),
  }),
  budgetId: z.number().positive().optional(),
  paymentMethodId: z.number().positive('支払い方法を選択してください'),
});

/**
 * 取引作成用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const createTransactionSchema = baseTransactionSchema;

/**
 * 取引更新用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const updateTransactionSchema = baseTransactionSchema.partial().extend({
  id: z.number().positive('有効な取引IDが必要です'),
});

/**
 * 取引削除用のバリデーションスキーマ
 */
export const deleteTransactionSchema = z.object({
  id: z.number().positive('有効な取引IDが必要です'),
});

/**
 * 取引検索・フィルタリング用のバリデーションスキーマ
 */
export const getTransactionsSchema = z.object({
  // 日付範囲
  startDate: z.date().optional(),
  endDate: z.date().optional(),

  // カテゴリーフィルター
  mainCategoryId: z.number().positive().optional(),
  subCategoryId: z.number().positive().optional(),

  // タイプフィルター
  type: z.enum(['income', 'expense']).optional(),

  // 予算フィルター
  budgetId: z.number().positive().optional(),

  // ページネーション
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),

  // ソート
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * フロントエンド（フォーム）用のバリデーションスキーマ
 * 文字列入力を数値に変換する処理を含む
 */
export const transactionFormSchema = z.object({
  // 金額（文字列 → 数値変換）
  amount: z
    .string()
    .min(1, '金額を入力してください')
    .refine((val) => !isNaN(Number(val)), '数値を入力してください')
    .transform((val) => Number(val))
    .refine((val) => val > 0, '金額は0より大きい数値である必要があります'),

  // タイプ
  type: z.enum(['income', 'expense'], {
    errorMap: () => ({ message: '収入または支出を選択してください' }),
  }),

  // カテゴリー（文字列 → 数値変換）
  mainCategoryId: z
    .string()
    .min(1, '親カテゴリーを選択してください')
    .transform((val) => Number(val))
    .refine((val) => val > 0, '有効な親カテゴリーを選択してください'),

  subCategoryId: z
    .string()
    .optional()
    .transform((val) => (val && val !== '' ? Number(val) : undefined)),

  // 説明
  description: z
    .string()
    .max(500, '説明は500文字以内で入力してください')
    .optional(),

  // 日付（文字列 → Date変換）
  date: z
    .string()
    .min(1, '日付を選択してください')
    .transform((val) => new Date(val))
    .refine((val) => !isNaN(val.getTime()), '有効な日付を選択してください'),

  // 予算（文字列 → 数値変換、オプショナル）
  budgetId: z
    .string()
    .optional()
    .transform((val) => (val && val !== '' ? Number(val) : undefined)),

  // 支払い方法（文字列 → 数値変換）
  paymentMethodId: z
    .string()
    .min(1, '支払い方法を選択してください')
    .transform((val) => Number(val))
    .refine((val) => val > 0, '有効な支払い方法を選択してください'),
});

/**
 * 月次集計用のバリデーションスキーマ
 */
export const getMonthlyStatsSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  mainCategoryId: z.number().positive().optional(),
});

/**
 * TypeScript型の生成
 */
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type DeleteTransactionInput = z.infer<typeof deleteTransactionSchema>;
export type GetTransactionsInput = z.infer<typeof getTransactionsSchema>;
export type TransactionFormInput = z.infer<typeof transactionFormSchema>;
export type GetMonthlyStatsInput = z.infer<typeof getMonthlyStatsSchema>;
