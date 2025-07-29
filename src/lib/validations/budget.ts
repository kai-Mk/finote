import { z } from 'zod';

/**
 * 予算の基本オブジェクトスキーマ（refineなし）
 */
const baseBudgetObjectSchema = z.object({
  name: z
    .string()
    .min(1, '予算名を入力してください')
    .max(100, '予算名は100文字以内で入力してください'),
  totalAmount: z
    .number()
    .positive('予算総額は0より大きい数値である必要があります')
    .int('予算総額は整数で入力してください'),
  startDate: z.date({
    errorMap: () => ({ message: '有効な開始日を入力してください' }),
  }),
  endDate: z.date({
    errorMap: () => ({ message: '有効な終了日を入力してください' }),
  }),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),
});

/**
 * 予算の基本バリデーションスキーマ（refine付き）
 */
export const baseBudgetSchema = baseBudgetObjectSchema.refine(
  (data) => data.endDate >= data.startDate,
  {
    message: '終了日は開始日以降の日付を選択してください',
    path: ['endDate'],
  }
);

/**
 * 予算作成用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const createBudgetSchema = baseBudgetSchema;

/**
 * 予算更新用のバリデーションスキーマ
 * API（tRPC）で使用
 */
export const updateBudgetSchema = baseBudgetObjectSchema
  .partial()
  .extend({
    id: z.number().positive('有効な予算IDが必要です'),
  })
  .refine(
    (data) => {
      // 開始日と終了日の両方が指定されている場合のみチェック
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: '終了日は開始日以降の日付を選択してください',
      path: ['endDate'],
    }
  );

/**
 * 予算削除用のバリデーションスキーマ
 */
export const deleteBudgetSchema = z.object({
  id: z.number().positive('有効な予算IDが必要です'),
});

/**
 * 予算取得用のバリデーションスキーマ
 */
export const getBudgetsSchema = z.object({
  // 名前での検索
  searchName: z.string().optional(),

  // 日付範囲フィルター
  filterStartDate: z.date().optional(),
  filterEndDate: z.date().optional(),

  // アクティブな予算のみ（現在の日付が予算期間内）
  activeOnly: z.boolean().default(false),

  // 関連する取引も含めて取得するか
  includeTransactions: z.boolean().default(false),

  // ページネーション
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().min(0).default(0),

  // ソート
  sortBy: z
    .enum(['name', 'totalAmount', 'startDate', 'endDate', 'createdAt'])
    .default('startDate'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

/**
 * 予算詳細取得用のバリデーションスキーマ
 */
export const getBudgetByIdSchema = z.object({
  id: z.number().positive('有効な予算IDが必要です'),
  includeTransactions: z.boolean().default(true),
  includeProgress: z.boolean().default(true), // 進捗情報も含めるか
});

/**
 * 予算進捗取得用のバリデーションスキーマ
 */
export const getBudgetProgressSchema = z.object({
  id: z.number().positive('有効な予算IDが必要です'),
  groupByCategory: z.boolean().default(false), // カテゴリー別の内訳も取得するか
});

/**
 * アクティブな予算一覧取得用のバリデーションスキーマ
 */
export const getActiveBudgetsSchema = z.object({
  date: z.date().default(() => new Date()), // 基準日（デフォルトは現在日）
  includeProgress: z.boolean().default(true),
});

/**
 * フロントエンド（フォーム）用のバリデーションスキーマ
 * 文字列入力を適切な型に変換する処理を含む
 */
export const budgetFormSchema = z
  .object({
    name: z
      .string()
      .min(1, '予算名を入力してください')
      .max(100, '予算名は100文字以内で入力してください'),

    // 予算総額（文字列 → 数値変換）
    totalAmount: z
      .string()
      .min(1, '予算総額を入力してください')
      .refine((val) => !isNaN(Number(val)), '数値を入力してください')
      .transform((val) => Number(val))
      .refine(
        (val) => val > 0,
        '予算総額は0より大きい数値である必要があります'
      ),

    // 開始日（文字列 → Date変換）
    startDate: z
      .string()
      .min(1, '開始日を選択してください')
      .transform((val) => new Date(val))
      .refine((val) => !isNaN(val.getTime()), '有効な開始日を選択してください'),

    // 終了日（文字列 → Date変換）
    endDate: z
      .string()
      .min(1, '終了日を選択してください')
      .transform((val) => new Date(val))
      .refine((val) => !isNaN(val.getTime()), '有効な終了日を選択してください'),

    description: z
      .string()
      .max(1000, '説明は1000文字以内で入力してください')
      .optional(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: '終了日は開始日以降の日付を選択してください',
    path: ['endDate'],
  });

/**
 * TypeScript型の生成
 */
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type DeleteBudgetInput = z.infer<typeof deleteBudgetSchema>;
export type GetBudgetsInput = z.infer<typeof getBudgetsSchema>;
export type GetBudgetByIdInput = z.infer<typeof getBudgetByIdSchema>;
export type GetBudgetProgressInput = z.infer<typeof getBudgetProgressSchema>;
export type GetActiveBudgetsInput = z.infer<typeof getActiveBudgetsSchema>;
export type BudgetFormInput = z.infer<typeof budgetFormSchema>;
